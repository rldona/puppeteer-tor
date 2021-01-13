const admin = require('firebase-admin');
const axios = require('axios');

const { spanish } = require('../config');
const { firestoreInit } = require('../utils');
const { initialize, getCollection, updateDocumentFromCollection } = require('../db/mongodb');

(async () => {

  const mongodb = await initialize();
  const mongodbCollection = await getCollection(mongodb, 'filmaffinity-db', 'reviews-es-test');
  const mongodbCollectionError = await getCollection(mongodb, 'filmaffinity-db', 'reviews-es-test-error');

  await firestoreInit();

  const reviews = await mongodbCollection.find({});

  reviews.each(async (err, doc) => {
    console.log(doc);
    if (err) {
      const errorLog = { index: doc.index, error: `${error}` };
      await mongodbCollectionError.insertOne(errorLog);
      await admin.firestore().collection(spanish.REVIEWS_ERROR).doc(`${errorLog.index}`).set(log);
    }
    if (doc) {
      const reviewRequest = await axios.get(`https://europe-west1-filmaffinity-api-functions.cloudfunctions.net/scrapper?index=${doc.index}`);
      const review = reviewRequest.data;
      await updateDocumentFromCollection(mongodbCollection, review.index, review, true);
      await admin.firestore().collection(spanish.REVIEWS_NORMAL).doc(`${review.index}`).set(review);
      console.log(`${review.index} | ${review.title} ==> upadated !!`);
    }
  });

})();
