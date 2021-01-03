
const puppeteer = require('puppeteer');
const admin = require("firebase-admin");

const serviceAccount = require("./filmaffinity-api-firebase-adminsdk-hfsxr-99032fbdcb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://filmaffinity-api.firebaseio.com"
});

const reviewsRefTest = admin.firestore().collection(`reviews-es`);
const reviewsRefError = admin.firestore().collection(`reviews-es-error`);

let counter = 0;

async function main(id, randomNumber) {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=socks5://127.0.0.1:90${randomNumber}`
    ]
  });

  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (request.resourceType() === 'document') {
        request.continue();
    } else {
        request.abort();
    }
  });

  try {
    const url = `https://www.filmaffinity.com/es/film${id}.html`;

    let browserLoad = await page.goto(url, { timeout: 0 });

    if (browserLoad.status() === 200) {
      const title = await page.evaluate(() => {
        return document.querySelector('[itemprop="name"]') ? document.querySelector('[itemprop="name"]').textContent : '';
      });
      console.log(`==> ${id} | ${title} <==`);
      await reviewsRefTest.doc(`${id}`).set({ title });
      counter++;
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

  for (let id = 160228; id < 200000 ; id++) {
    await main(id, Math.floor(Math.random() * (62 - 52 + 1)) + 52);
  }

  console.log(`\n\n==> Scrappig finished ==> ${counter}/100000 reviews in total <==\n\n`);

  process.exit(1);

})();
