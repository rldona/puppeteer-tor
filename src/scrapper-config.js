const puppeteer                 = require('puppeteer');
const admin                     = require('firebase-admin');
const { config, spanish }       = require('../config');
const { delay, getUrl }         = require('../utils');
const { getFilmaffinityReview } = require('./scrapper-page');




async function scrapper (index, mongodbCollection, mongodbCollectionError) {
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

  const url = getUrl(index);

  try {
    let browserLoad = await page.goto(url, { waitUntil: spanish.LOAD, timeout: 0 });

    if (browserLoad.status() === 200) {
      const review = await getFilmaffinityReview(page);
      const doc    = { index, ...review, url };

      await admin.firestore().collection(spanish.REVIEWS_NORMAL).doc(`${index}`).set(doc);

      const item = await mongodbCollection.find({ index : index }).limit(1).count();

      if (item) {
        mongodbCollection.updateOne (
          { index: index }, {
            $set: {
              "sinopsis": review.sinopsis,
              "rating_average": review.rating_average,
              "rating_count": review.rating_count,
              "professional_register": review.professional_register,
              "professional_reviews": review.professional_reviews,
              "thumbnail_medium": review.thumbnail_medium,
              "thumbnail_large": review.thumbnail_large
            },
            $currentDate: {
              lastModified: true
            }
          }
       )
      } else {
        await mongodbCollection.insertOne(doc);
      }

      console.log(`${browserLoad.status()} | ${index} | ${review.title}`);
    }
  } catch (error) {
    const log = { index, error: `${error}` };
    await admin.firestore().collection(spanish.REVIEWS_ERROR).doc(`${index}`).set(log);
    await mongodbCollectionError.insertOne(log);
  } finally {
    await browser.close();
  }
}

module.exports = {
  scrapper
}
