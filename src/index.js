const pm2 = require('pm2');

const { config, spanish } = require('../config');
const { firestoreInit, sleep } = require('../utils');
const { scrapper } = require('./scrapper-config');

const { initialize, getCollection } = require('../db');

(async () => {

  const mongodb = await initialize();
  const mongodbCollection = await getCollection(mongodb, 'filmaffinity-db', 'reviews-es');
  const mongodbCollectionError = await getCollection(mongodb, 'filmaffinity-db', 'reviews-es-error');

  await firestoreInit();

  let id = config.range.start, loopCheck;

  while (id <= config.range.end) {
    await sleep(id, config.sleep.multipleCheck, config.sleep.shortMinutes);
    await scrapper(id, mongodbCollection, mongodbCollectionError);
    loopCheck = id === config.range.end ? id = config.range.start : id++;
  }

})();
