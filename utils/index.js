const admin = require('firebase-admin');
const { config } = require('../config');
const serviceAccount = require('../secrets/filmaffinity-api-firebase-adminsdk-hfsxr-99032fbdcb.json');

async function firestoreInit () {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: config.databaseURL
  });
}

function getUrl (id) {
  return `https://www.filmaffinity.com/${config.language}/film${id}.html`
}

function delay (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  });
}

async function sleep (id, multipleCheck, minutes) {
  if (id % multipleCheck === 0 && id !== config.range.start) {
    console.log(`\n Sleeping ${minutes} minutes...\n`);
    await delay(config.sleep.milisecondsConverter * minutes);
  }
}

module.exports = {
  firestoreInit,
  getUrl,
  delay,
  sleep
}
