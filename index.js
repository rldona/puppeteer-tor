
const puppeteer = require('puppeteer');

async function main(randomNumber) {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=socks5://127.0.0.1:90${randomNumber}`
    ]
  });

  const page = await browser.newPage();

  // await page.setRequestInterception(true);

  // page.on('request', (request) => {
  //     if (request.resourceType() === 'document') {
  //         request.continue();
  //     } else {
  //         request.abort();
  //     }
  // });

  await page.goto('https://www.filmaffinity.com/es/film335397.html', { timeout: 0 });

  const h2Tags = await page.$$eval('h2', h2 => h2.length);

  console.log(h2Tags);

  await browser.close();

}

(async () => {

  let randomNumber;

  for (let id = 0; id < 1000 ; id++) {
    if (id !== 0 && id % 10 === 0) {
      console.log(`\n\n[========================================]`);
      console.log(`[==> ${id} <==]    Ramdonized    [==> ${id} <==]`);
      console.log(`[========================================]\n`);
      randomNumber = Math.floor(Math.random() * (62 - 52 + 1)) + 52;
    }

    console.log(`\n[==> ${id} <==] Scrapping [==> ${id} <==]\n`);

    await main(randomNumber);
  }

})();
