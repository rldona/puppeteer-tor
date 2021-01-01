
const puppeteer = require('puppeteer');
const getProxies = require("get-free-https-proxy");

async function main(proxy) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // `--proxy-server=${proxy.host}:${proxy.port}`
      `--proxy-server=socks5://127.0.0.1:90${randomNumber}`
    ]
  });

  const page = await browser.newPage();

  await page.goto('https://whatismycountry.com/');

  const result = await page.evaluate(async () => {
    return document.querySelector('h2').textContent;
  });

  console.log(result);

  await browser.close();

}

//// => 139.47.114.63 (Sabadell)
//// => 134.209.226.5 (DigitalOcean)
//// => 185.124.31.83 (Proxy List)

(async () => {

  // const proxieList = await getProxies();
  const randomNumber = Math.floor(Math.random() * (72 - 52 + 1)) + 52;
  // const randomProxy = proxieList[randomNumber];

  // console.log(randomNumber);

  for (let id = 0; id < 100; id++) {
    await main(randomNumber);
  }

})();
