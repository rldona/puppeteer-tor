
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

  await page.goto('https://ipinfo.io/json', { timeout: 0 });

  const content = await page.content();
  const serialized = content.substring(content.indexOf('{'), content.indexOf('}') + 1);

  console.log(JSON.parse(serialized));

  await browser.close();

}

(async () => {

  for (let id = 0; id < 1000 ; id++) {
    const randomNumber = Math.floor(Math.random() * (62 - 52 + 1)) + 52;
    await main(randomNumber);
  }

  // let rotateNumber = 52;

  // for (let id = 0; id < 100000 ; id++) {
  //   await main(rotateNumber);

  //   rotateNumber++;

  //   if (rotateNumber === 99) {
  //     rotateNumber = 52;
  //   }
  // }

})();
