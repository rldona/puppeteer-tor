const { initialize, getCollection } = require('../db/mongodb');
const { config } = require('../config');
const { sleep } = require('../utils');
const { scrapper } = require('../src/scrapper-config');

test('Config is defined', async () => {
  config.toBeDefined
})
