const pm2 = require('pm2');

const { config, spanish }           = require('../config');
const { firestoreInit, sleep }      = require('../utils');
const { scrapper }                  = require('./scrapper-config');
const { initialize, getCollection } = require('../db/mongodb');

// TODO: cambiar el nombre del respositorio => filmaffinity-scrapper-batch
//
// Project Filmaffinity Scrapper:
//
// filmaffinity-scrapper-batch
// filmaffinity-scrapper-function
// filmaffinity-scrapper-api
//
// TODO: unificar todo en un único repositiorio
//

(async () => {

  const mongodb                = await initialize();
  const mongodbCollection      = await getCollection(mongodb, 'filmaffinity-db', 'reviews-es');
  const mongodbCollectionError = await getCollection(mongodb, 'filmaffinity-db', 'reviews-es-error');

  await firestoreInit();

  let index = config.range.start, loopCheck;

  while (index <= config.range.end) {
    await sleep(index, config.sleep.multipleCheck, config.sleep.shortMinutes);
    await scrapper(index, mongodbCollection, mongodbCollectionError);
    loopCheck = index === config.range.end ? index = config.range.start : index++;
  }

})();
