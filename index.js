
const puppeteer = require('puppeteer');

let counter = 0;

async function main(id, randomNumber) {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=socks5://127.0.0.1:90${randomNumber}`
    ]
  });

  ////

  const page = await browser.newPage();

  await page.setRequestInterception(true);

  page.on('request', (request) => {
    if (request.resourceType() === 'document') {
        request.continue();
    } else {
        request.abort();
    }
  });

  ////

  const url = `https://www.filmaffinity.com/es/film${id}.html`;

  let browserLoad = await page.goto(url, { waitUntil: 'load', timeout: 0 });

  if (browserLoad.status() === 200) {
    const title = await page.evaluate(() => {
      return document.querySelector('[itemprop="name"]') ? document.querySelector('[itemprop="name"]').textContent : '';
    });
    console.log(`==> ${id} | ${title} <==`);
    counter++;
  }

  ////

  await browser.close();

}

(async () => {

  for (let id = 100000; id < 200000 ; id++) {
    await main(id, Math.floor(Math.random() * (99 - 52 + 1)) + 52);
  }

  console.log(`\n\n==> Scrappig finished ==> ${counter}/100000 reviews in total <==\n\n`);

  process.exit(1);

})();
