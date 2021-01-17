const language = 'es';

const spanish = {
  'REQUEST': 'request',
  'DOCUMENT': 'document',
  'SCRAPPER': 'scrapper',
  'LOAD': 'load',
  'SLEEP_60_MINUTES': `\n Sleeping 60 minutes...\n`
}

const config = {
  language: language,
  databaseURL: 'https://filmaffinity-api.firebaseio.com',
  headless: true,
  ignoreHTTPSErrors: true,
  args: {
    noSandbox: '--no-sandbox',
    disableSetuid: '--disable-setuid-sandbox'
  },
  setRequestInterception: true,
  view: {
    width: 1024,
    height: 2500
  },
  range: {
    start: parseInt(process.argv[2]),
    end: parseInt(process.argv[3])
  },
  proxy: {
    range: {
      min: 52,
      max: 62
    }
  },
  sleep: {
    shortMinutes: 1,
    multipleCheck: 1000,
    milisecondsConverter: 60000
  },
  mongodb: {
    database: 'filmaffinity-db',
    collection: `reviews-${language}`,
    collectionError: `reviews-${language}-error`,
    collectionUpdatedError: `reviews-${language}-updated-error`
  }
}

module.exports = {
  spanish,
  config
};
