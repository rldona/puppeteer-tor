
const puppeteer = require('puppeteer');
const ipify = require('ipify');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--proxy-server=socks5://127.0.0.1:9053'
    ]
  });

  const page = await browser.newPage();

  await page.goto('https://api.ipify.org');

  const ip = await ipify({ useIPv6: false });

  console.log(ip);

  browser.close();
}

//// => 139.47.114.63 (Sabadell)
//// => 134.209.226.5 (DigitalOcean)
//// => xxx.xxx.xxx.x (Tor)

main();
