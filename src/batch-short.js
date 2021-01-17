const axios = require('axios');

const { config, argsOptions } = require('../config');
const { initialize, getCollection, updateDocumentFromCollection } = require('../db/mongodb');

function getCloudFunctionUrl (index, language) {
  return `https://europe-west1-filmaffinity-api-functions.cloudfunctions.net/scrapper?index=${index}&language=${language}`;
}

(async () => {

  if (!config.language) {
    console.log(`\nEs necesario configurar algunos argumentos obligatorios | Language => ${config.language}`);
    console.log(`\nEjemplo de uso: node batch-short.js en\n`);
    process.exit();
  }

  const mongodb = await initialize();
  const mongodbCollection = await getCollection(mongodb, config.mongodb.database, config.mongodb.collection);
  const mongodbCollectionUpdatedError = await getCollection(mongodb, config.mongodb.database, config.mongodb.collectionUpdatedError);

  let allReviewsByIds = []

  await mongodbCollection.find({}).forEach(doc => {
    allReviewsByIds.push(doc.index);
  });

  console.log(allReviewsByIds);

  let index = 0, loopCheck;

  while (index <= allReviewsByIds.length) {
    try {
      const reviewRequest = await axios.get(getCloudFunctionUrl(allReviewsByIds[index], argsOptions.language));
      const review = reviewRequest.data;
      await updateDocumentFromCollection(mongodbCollection, review.index, review, true);
      console.log(`${review.index} | ${review.title} => Upadated`);
    } catch (error) {
      const log = { index: allReviewsByIds[index], error: `${error}` };
      await mongodbCollectionUpdatedError.insertOne(log);
    }
    loopCheck = index === allReviewsByIds.length - 1 ? index = 0 : index++;
  }

})();
