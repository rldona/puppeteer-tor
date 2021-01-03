
const puppeteer = require('puppeteer');
const admin = require("firebase-admin");

const serviceAccount = require("./filmaffinity-api-firebase-adminsdk-hfsxr-99032fbdcb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://filmaffinity-api.firebaseio.com"
});

const reviewsRefTest = admin.firestore().collection(`reviews-es`);
const reviewsRefError = ;

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

async function main(id, randomNumber) {
  const browser = await puppeteer.launch({
    headless: config.headless,
    ignoreHTTPSErrors: config.ignoreHTTPSErrors,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=socks5://127.0.0.1:90${randomNumber}`
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
    let browserLoad = await page.goto(url, { timeout: 0 });

    if (browserLoad.status() === 200) {
      const title = await page.evaluate(() => {
        return document.querySelector('[itemprop="name"]') ? document.querySelector('[itemprop="name"]').textContent : '';
      });
      console.log(`==> ${id} | ${title} <==`);
      await reviewsRefTest.doc(`${id}`).set({ title });
    }

    if (browserLoad.status() === 429) {
      console.log(`==> CAZADO :( <==`);
      await reviewsRefError.doc(`${id}`).set({ title, randomNumber, error: 429 });
    }
  } catch (error) {
    console.log(error);
    await reviewsRefError.doc(`${id}`).set({ randomNumber, error });
  }

  await browser.close();

}

(async () => {

  for (let id = config.range.start; id < config.range.end ; id++) {
    const randomNumber = Math.floor(Math.random() * (config.proxy.range.max - config.proxy.range.min + 1)) + config.proxy.range.min;
    await main(id, randomNumber);
  }

  process.exit(1);

})();
