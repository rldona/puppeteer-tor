
const puppeteer = require('puppeteer');

async function main() {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.goto('https://api.ipify.org');

  setTimeout(() => {
    browser.close();
  }, 5000);
}

////=> 139.47.114.63 (static IP)

main();
