const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const filePath = path.resolve(__dirname, 'index.html');
  await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
  await page.waitForTimeout(2000);

  await page.pdf({
    path: path.resolve(__dirname, 'APEX_OS_Pitch_Deck_v2.0.pdf'),
    width: '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

  console.log('PDF exported: APEX_OS_Pitch_Deck_v2.0.pdf');
  await browser.close();
})();
