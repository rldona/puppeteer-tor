const pm2 = require('pm2');
const puppeteer = require('puppeteer');
const admin = require("firebase-admin");
const serviceAccount = require("./filmaffinity-api-firebase-adminsdk-hfsxr-99032fbdcb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://filmaffinity-api.firebaseio.com"
});

const language = 'es';

const config = {
  db: admin.firestore(),
  headless: true,
  ignoreHTTPSErrors: true,
  view: {
    width: 1024,
    height: 2500
  },
  range: {
    start: parseInt(process.argv[2]),
    end: parseInt(process.argv[3])
  },
  proxy: {
    range: {
      min: 52,
      max: 62
    }
  },
  firestore: {
    references: {
      normal: admin.firestore().collection(`reviews-${language}`),
      error: admin.firestore().collection(`reviews-${language}-error`)
    }
  }
}

async function main(id) {
  const browser = await puppeteer.launch({
    headless: config.headless,
    ignoreHTTPSErrors: config.ignoreHTTPSErrors,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ]
  });

  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  await page.setViewport({ width: config.view.width, height: config.view.height });

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (request.resourceType() === 'document') {
        request.continue();
    } else {
        request.abort();
    }
  });

  const url = `https://www.filmaffinity.com/${language}/film${id}.html`;

  try {
    let browserLoad = await page.goto(url, { timeout: 0 }), title;

    if (browserLoad.status() === 200) {
      title = await page.evaluate(() => {
        return document.querySelector('[itemprop="name"]') ? document.querySelector('[itemprop="name"]').textContent : '';
      });
      await config.firestore.references.normal.doc(`${id}`).set({ title });
      console.log(`${browserLoad.status()} | ${id} | ${title}`);
    }

    if (browserLoad.status() === 429) {
      await config.firestore.references.error.doc(`${id}`).set({ date: new Date(), error: 429 });
      pm2.stop('index');
    }
  } catch (error) {
    await config.firestore.references.error.doc(`${id}`).set({ error: `${error}` });
  } finally {
    await browser.close();
  }
}

function delay (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  });
}

async function sleep (minutes, id, reviews) {
  if (id % reviews === 0) {
    console.log(`\n Sleeping ${minutes} minutes...\n`);
    await delay(60000 * minutes);
  }
}

(async () => {

  for (let id = config.range.start; id < config.range.end ; id++) {
    await sleep(5, id, 1000);
    await main(id);
  }

  // await main(177901);

  ////

  // const reviews = await admin.firestore().collection(`reviews-${language}`).limit(10).get();

  // let reviewsTotal = [];

  // reviews.docs.forEach((doc) => {
  //   if (parseInt(doc.id) >= 100000 && parseInt(doc.id) < 200000) {
  //     console.log(doc.id);
  //     // await sleep(5, id, 1000);
  //     // await main(id);
  //     reviewsTotal.push(doc);
  //   }
  // });

  // console.log(reviewsTotal.length);

  ////

  pm2.stop('index');
  pm2.delete('index');

})();
