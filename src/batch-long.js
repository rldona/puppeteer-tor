const { config } = require('../config');
const { firestoreInit, sleep } = require('../utils');
const { scrapper } = require('./scrapper-config');
const { initialize, getCollection } = require('../db/mongodb');

(async () => {

  // TODO: Sacar a una .js separado de mongodbInit();
  const mongodb = await initialize();
  const mongodbCollection = await getCollection(mongodb, config.mongodb.database, config.mongodb.collection);
  const mongodbCollectionError = await getCollection(mongodb, config.mongodb.database, config.mongodb.collectionError);

  // await mongodbInit();
  await firestoreInit();

  let index = config.range.start, loopCheck;

  while (index <= config.range.end) {
    await sleep(index, config.sleep.multipleCheck, config.sleep.shortMinutes);
    await scrapper(index, mongodbCollection, mongodbCollectionError);
    loopCheck = index === config.range.end ? index = config.range.start : index++;
  }

})();
