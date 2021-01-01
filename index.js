
const puppeteer = require('puppeteer');
const getProxies = require("get-free-https-proxy");

async function main(proxy) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      `--proxy-server=${proxy.host}:${proxy.port}`
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
  // const randomProxy = proxieList[Math.floor(Math.random() * (proxieList.length - 0 + 1)) + 0];

  // console.log(proxieList);

  const randomProxy = {
    host: '198.50.163.192',
    port: 3129
  }

  for (let id = 0; id < 100000; id++) {
    await main(randomProxy);
  }

})();
