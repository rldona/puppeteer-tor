
const puppeteer = require('puppeteer');

async function main(randomNumber) {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=socks5://127.0.0.1:9052`
    ]
  });

  const page = await browser.newPage();

  await page.goto('https://ipinfo.io/json', { timeout: 0 });

  const content = await page.content();
  const serialized = content.substring(content.indexOf('{'), content.indexOf('}') + 1);

  console.log(JSON.parse(serialized));

  await browser.close();

}

(async () => {

  let randomNumber;

  for (let id = 0; id < 1000 ; id++) {
    if (id !== 0 && id % 500 === 0) {
      console.log(`[: ${id} :] Ramdonized [: ${id} :]`);
      randomNumber = Math.floor(Math.random() * (53 - 52 + 1)) + 52;
    }

    console.log(`[==> ${id} <==] Scrapping [==> ${id} <==]`);

    await main(randomNumber);
  }

})();
