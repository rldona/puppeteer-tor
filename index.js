
const puppeteer = require('puppeteer');
const ipify = require('ipify');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('https://api.ipify.org');

  const ip = await ipify({ useIPv6: false });

  console.log(ip);

  browser.close();
}

////=> 139.47.114.63 (static IP)

main();
