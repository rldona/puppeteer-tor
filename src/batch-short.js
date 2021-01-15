const axios = require('axios');

const { config } = require('../config');
const { initialize, getCollection, updateDocumentFromCollection } = require('../db/mongodb');

function getCloudFunctionUrl (index) {
  return `https://europe-west1-filmaffinity-api-functions.cloudfunctions.net/scrapper?index=${index}`;
}

(async () => {

  // TODO: Sacar a una .js separado de mongodbInit();
  const mongodb = await initialize();
  const mongodbCollection = await getCollection(mongodb, config.mongodb.database, config.mongodb.collection);
  const mongodbCollectionUpdatedError = await getCollection(mongodb, config.mongodb.database, config.mongodb.collectionUpdatedError);

  // await mongodbInit();

  const allReviewsByIds = []

  await mongodbCollection.find({}).forEach(doc => {
    allReviewsByIds.push(doc.index);
  });

  console.log(allReviewsByIds);

  for (let index = 0; index < allReviewsByIds.length; index++) {
    try {
      const reviewRequest = await axios.get(getCloudFunctionUrl(allReviewsByIds[index]));
      const review = reviewRequest.data;
      await updateDocumentFromCollection(mongodbCollection, review.index, review, true);
      console.log(`${review.index} | ${review.title} => Upadated`);
    } catch (error) {
      const log = { index, error: `${error}` };
      await mongodbCollectionUpdatedError.insertOne(log);
    }
  }

})();
