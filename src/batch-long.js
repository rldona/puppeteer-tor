const { initialize, getCollection } = require('../db/mongodb');
const { config } = require('../config');
const { sleep } = require('../utils');
const { scrapper } = require('./scrapper-config');

(async () => {

  if (!config.range.start || !config.range.end || !config.language) {
    console.log(`\nEs necesario configurar algunos argumentos obligatorios | Range(start) => ${config.range.start} - Range(end) => ${config.range.end} - Language => ${config.language}`);
    console.log(`\nEjemplo de uso: node batch-long.js en 100000 200000\n`);
    process.exit();
  }

  const mongodb = await initialize();
  const mongodbCollection = await getCollection(mongodb, config.mongodb.database, config.mongodb.collection);
  const mongodbCollectionError = await getCollection(mongodb, config.mongodb.database, config.mongodb.collectionError);

  let index = config.range.start, loopCheck;

  while (index <= config.range.end) {
    await sleep(index, config.sleep.multipleCheck, config.sleep.shortMinutes);
    await scrapper(index, mongodbCollection, mongodbCollectionError);
    loopCheck = index === config.range.end ? index = config.range.start : index++;
  }

})();
