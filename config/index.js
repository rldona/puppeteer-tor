const translations = {
  es: {
    'REQUEST': 'request',
    'DOCUMENT': 'document',
    'SCRAPPER': 'scrapper',
    'LOAD': 'load',
    'SLEEP_60_MINUTES': `\n Sleeping 60 minutes...\n`
  }
};

const argsOptions = {
  long: {
    startProcess: parseInt(process.argv[3]) || null,
    endProcess: parseInt(process.argv[4]) || null,
  },
  language: process.argv[2] || null
}

const config = {
  language: argsOptions.language,
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
    start: argsOptions.long.startProcess,
    end: argsOptions.long.endProcess
  },
  sleep: {
    shortMinutes: 1,
    multipleCheck: 1000,
    milisecondsConverter: 60000
  },
  mongodb: {
    database: 'filmaffinity-db',
    collection: `reviews-${argsOptions.language}`,
    collectionError: `reviews-${argsOptions.language}-error`,
    collectionUpdatedError: `reviews-${argsOptions.language}-updated-error`
  }
}

module.exports = {
  translations,
  argsOptions,
  config
};
