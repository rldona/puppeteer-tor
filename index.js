
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

  await page.goto('https://www.filmaffinity.com/es/film335397.html', { timeout: 0 });

  const divTags = await page.$$eval('div', div => div.length);

  console.log(divTags);

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
