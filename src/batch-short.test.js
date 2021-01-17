const axios = require('axios');

const { config } = require('../config');
const { initialize, getCollection, updateDocumentFromCollection } = require('../db/mongodb');

test('Config is defined', async () => {
  config.toBeDefined
})
