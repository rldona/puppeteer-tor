const pm2 = require('pm2');

const { firestoreInit } = require('../utils/firestore-config');
const { config, spanish } = require('../config');
const { sleep } = require('../utils');
const { scrapper } = require('./scrapper-config');

(async () => {

  await firestoreInit();

  for (let id = config.range.start; id < config.range.end ; id++) {
    await sleep(id, config.sleep.multipleCheck, config.sleep.shortMinutes);
    await scrapper(id);
  }

  pm2.delete(spanish.SCRAPPER);

})();
