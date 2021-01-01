
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

  await page.setRequestInterception(true);

  page.on('request', (request) => {
      if (request.resourceType() === 'document') {
          request.continue();
      } else {
          request.abort();
      }
  });

  await page.goto('https://whatismycountry.com', { timeout: 0 });

  const h2Tags = await page.$$eval('h2', h2 => (h2[0].textContent).split('Your Country is ')[1]);

  console.log(h2Tags);

  await browser.close();

}

(async () => {
  for (let id = 0; id < 1000 ; id++) {
    await main(Math.floor(Math.random() * (82 - 52 + 1)) + 52);
  }
})();
