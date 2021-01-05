const pm2 = require('pm2');

const { config, spanish } = require('../config');
const { firestoreInit, sleep } = require('../utils');
const { scrapper } = require('./scrapper-config');

(async () => {

  let id = config.range.start, loopCheck;

  await firestoreInit();

  while (id <= config.range.end) {
    await sleep(id, config.sleep.multipleCheck, config.sleep.shortMinutes);
    await scrapper(id);
    loopCheck = id === config.range.end ? id = config.range.start : id++;
  }

})();
