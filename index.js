
const puppeteer = require('puppeteer');

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto('https://api.ipify.org');

  setTimeout(() => {
    browser.close();
  }, 5000);
}

////=> 139.47.114.63 (static IP)

main();
