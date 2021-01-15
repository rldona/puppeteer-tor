const { config } = require('../config');

/**
 *
 * @param {*} id
 */
function getUrl (id) {
  return `https://www.filmaffinity.com/${config.language}/film${id}.html`
}

/**
 *
 * @param {*} time
 */
function delay (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  });
}

/**
 *
 * @param {*} id
 * @param {*} multipleCheck
 * @param {*} minutes
 */
async function sleep (id, multipleCheck, minutes) {
  if (id % multipleCheck === 0 && id !== config.range.start) {
    console.log(`\n Sleeping ${minutes} minutes...\n`);
    await delay(config.sleep.milisecondsConverter * minutes);
  }
}

module.exports = {
  getUrl,
  delay,
  sleep
}
