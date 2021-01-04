const pm2 = require('pm2');
const puppeteer = require('puppeteer');
const admin = require("firebase-admin");
const serviceAccount = require("./filmaffinity-api-firebase-adminsdk-hfsxr-99032fbdcb.json");

const filmaffinityScrapper = require("./filmaffinity-scraper");

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

async function main (id) {
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

    let browserLoad = await page.goto(url, { waitUntil: 'load', timeout: 0 });

    if (browserLoad.status() === 200) {
      const review = await filmaffinityScrapper.init(page);
      console.log(review);
      // await config.firestore.references.normal.doc(`${id}`).set({ id, ...review, url });
      console.log(`${browserLoad.status()} | ${id} | ${review.title}`);
    }

    if (browserLoad.status() === 429) {
      await config.firestore.references.error.doc(`${id}`).set({ date: new Date(), error: 429 });
      await delay(60000 * 60);
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
  if (id % reviews === 0 && id !== config.range.start) {
    console.log(`\n Sleeping ${minutes} minutes...\n`);
    await delay(60000 * minutes);
  }
}

(async () => {

  for (let id = config.range.start; id < config.range.end ; id++) {
    await sleep(5, id, 1000);
    await main(id);
  }

  pm2.stop('scrapper');

})();
