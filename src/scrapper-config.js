const puppeteer = require('puppeteer');
const admin = require('firebase-admin');

const { config, spanish } = require('../config');
const { delay, getUrl } = require('../utils');

const { getFilmaffinityReview } = require('./scrapper-page');

async function scrapper (id, mongodbCollection, mongodbCollectionError) {
  const browser = await puppeteer.launch({
    headless: config.headless,
    ignoreHTTPSErrors: config.ignoreHTTPSErrors,
    args: [config.args.noSandbox, config.args.disableSetuid]
  });

  const page = await browser.newPage();

  await page.setViewport({ width: config.view.width, height: config.view.height });
  await page.setRequestInterception(config.setRequestInterception);

  page.on(spanish.REQUEST, (request) => {
    if (request.resourceType() === spanish.DOCUMENT) {
        request.continue();
    } else {
        request.abort();
    }
  });

  const url = getUrl(id);

  try {
    let browserLoad = await page.goto(url, { waitUntil: spanish.LOAD, timeout: 0 });

    if (browserLoad.status() === 200) {
      const review = await getFilmaffinityReview(page);
      await admin.firestore().collection(spanish.REVIEWS_NORMAL).doc(`${id}`).set({ id, ...review, url });
      await mongodbCollection.update({...review}, {...review}, { upsert: true });
      console.log(`${browserLoad.status()} | ${id} | ${review.title}`);
    }

    if (browserLoad.status() === 429) {
      await admin.firestore().collection(spanish.REVIEWS_ERROR).doc(`${id}`).set({ date: new Date(), error: 429 });
      console.log(spanish.SLEEP_60_MINUTES);
      await delay(config.sleep.milisecondsConverter * config.sleep.longMinutes);
    }
  } catch (error) {
    const log = { id, error: `${error}` };
    await admin.firestore().collection(spanish.REVIEWS_ERROR).doc(`${id}`).set(log);
    await mongodbCollectionError.insertOne(log);
  } finally {
    await browser.close();
  }
}

module.exports = {
  scrapper
}
