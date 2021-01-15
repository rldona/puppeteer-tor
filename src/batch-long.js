const { initialize, getCollection } = require('../db/mongodb');
const { config } = require('../config');
const { sleep } = require('../utils');
const { scrapper } = require('./scrapper-config');

(async () => {

  const mongodb = await initialize();
  const mongodbCollection = await getCollection(mongodb, config.mongodb.database, config.mongodb.collection);
  const mongodbCollectionError = await getCollection(mongodb, config.mongodb.database, config.mongodb.collectionError);

  let index = config.range.start;
  let loopCheck;

  while (index <= config.range.end) {
    await sleep(index, config.sleep.multipleCheck, config.sleep.shortMinutes);
    await scrapper(index, mongodbCollection, mongodbCollectionError);
    loopCheck = index === config.range.end ? index = config.range.start : index++;
  }

})();
