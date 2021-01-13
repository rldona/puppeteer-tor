const admin = require('firebase-admin');
const axios = require('axios');

const { config, spanish } = require('../config');
const { firestoreInit } = require('../utils');
const { initialize, getCollection, updateDocumentFromCollection } = require('../db/mongodb');

function getCloudFunctionUrl (index) {
  return `https://europe-west1-filmaffinity-api-functions.cloudfunctions.net/scrapper?index=${index}`;
}

(async () => {

  // TODO: Sacar a una .js separado de mongodbInit();
  const mongodb = await initialize();
  const mongodbCollection = await getCollection(mongodb, config.mongodb.database, config.mongodb.collection);
  const mongodbCollectionError = await getCollection(mongodb, config.mongodb.database, config.mongodb.collectionError);

  // await mongodbInit();
  await firestoreInit();

  const reviews = await mongodbCollection.find({});

  reviews.each(async (err, doc) => {
    console.log(doc);
    if (err) {
      const errorLog = { index: doc.index, error: `${error}` };
      await mongodbCollectionError.insertOne(errorLog);
      await admin.firestore().collection(config.firestore.collectionError).doc(`${errorLog.index}`).set(log);
    }
    if (doc) {
      const reviewRequest = await axios.get(getCloudFunctionUrl(doc.index));
      const review = reviewRequest.data;
      await updateDocumentFromCollection(mongodbCollection, review.index, review, true);
      await admin.firestore().collection(config.firestore.collection).doc(`${review.index}`).set(review);
      console.log(`${review.index} | ${review.title} ==> upadated !!`);
    }
  });

})();
