const puppeteer = require('puppeteer');

const { config, translations } = require('../config');
const { getUrl } = require('../utils');
const { getFilmaffinityReview } = require('./scrapper-page');
const { updateDocumentFromCollection } = require('../db/mongodb');

/**
 *
 * @param {*} index
 * @param {*} mongodbCollection
 * @param {*} mongodbCollectionError
 */
async function scrapper (index, mongodbCollection, mongodbCollectionError) {
  const browser = await puppeteer.launch({
    headless: config.headless,
    ignoreHTTPSErrors: config.ignoreHTTPSErrors,
    args: [config.args.noSandbox, config.args.disableSetuid]
  });

  const page = await browser.newPage();

  await page.setViewport({ width: config.view.width, height: config.view.height });
  await page.setRequestInterception(config.setRequestInterception);

  page.on(translations.es.REQUEST, (request) => {
    if (request.resourceType() === translations.es.DOCUMENT) {
      request.continue();
    } else {
      request.abort();
    }
  });

  const url = getUrl(index);

  let state;

  try {
    let browserLoad = await page.goto(url, { waitUntil: translations.es.LOAD, timeout: 0 });

    if (browserLoad.status() === 200) {
      const review = await getFilmaffinityReview(page);
      const doc = { index, ...review, url };

      const item = await mongodbCollection.find({ 'index' : index }).limit(1).count();

      if (item) {
        await updateDocumentFromCollection(mongodbCollection, index, review, true);
        state = 'updated';
      } else {
        await mongodbCollection.insertOne(doc);
        state = 'new';
      }

      console.log(`${browserLoad.status()} | ${index} | ${review.title} ==> ${state === 'updated' ? 'updated !' : 'new review !'}`);
    }
  } catch (error) {
    const log = { index, error: `${error}` };
    await mongodbCollectionError.insertOne(log);
  } finally {
    await browser.close();
  }
}

module.exports = {
  scrapper
}
