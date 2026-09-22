const path = require('path');
const fs = require('fs');
const { chromium } = require(require.resolve('playwright', { paths: [path.join(__dirname, '..', 'server')] }));

const clientScreenshotsDir = path.join(__dirname, '..', 'client', 'public', 'screenshots');
const serverScreenshotsDir = path.join(__dirname, '..', 'server', 'public', 'screenshots');

if (!fs.existsSync(clientScreenshotsDir)) fs.mkdirSync(clientScreenshotsDir, { recursive: true });
if (!fs.existsSync(serverScreenshotsDir)) fs.mkdirSync(serverScreenshotsDir, { recursive: true });

async function captureAllStorefronts() {
  console.log('=== STARTING CAPTURE OF FLOWSHOP AUDIO STOREFRONTS ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Helper to save to both client and server screenshots dirs
  const saveScreenshot = async (filename) => {
    const clientPath = path.join(clientScreenshotsDir, filename);
    const serverPath = path.join(serverScreenshotsDir, filename);
    await page.screenshot({ path: clientPath });
    fs.copyFileSync(clientPath, serverPath);
    console.log(`Saved: ${filename}`);
  };

  // 1. novatech_pdp.png (English FlowShop PDP - Exact user image 1 reference)
  console.log('1. Capturing novatech_pdp.png...');
  await page.goto('http://localhost:5000/demo-shop', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await saveScreenshot('novatech_pdp.png');

  // 2. novatech_home_live.png (FlowShop Storefront / Hero)
  console.log('2. Capturing novatech_home_live.png...');
  await saveScreenshot('novatech_home_live.png');

  // 3. novatech_cart_live.png (Cart Drawer open with SAVE20 applied)
  console.log('3. Capturing novatech_cart_live.png...');
  await page.click('#btn-add-to-cart');
  await page.waitForTimeout(400);
  await page.fill('#coupon-input', 'SAVE20');
  await page.click('#btn-apply-coupon');
  await page.waitForTimeout(400);
  await saveScreenshot('novatech_cart_live.png');

  // 4. novatech_checkout_live.png (Checkout Modal open)
  console.log('4. Capturing novatech_checkout_live.png...');
  await page.click('#btn-to-checkout');
  await page.waitForTimeout(500);
  await saveScreenshot('novatech_checkout_live.png');

  // Close checkout modal
  await page.evaluate(() => {
    if (typeof closeCheckoutModal === 'function') closeCheckoutModal();
    if (typeof toggleCart === 'function') toggleCart(false);
  });
  await page.waitForTimeout(300);

  // 5. novatech_category.png (Audio Devices & Catalog View)
  console.log('5. Capturing novatech_category.png...');
  await page.goto('http://localhost:5000/demo-shop', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = document.getElementById('related-title');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(400);
  await saveScreenshot('novatech_category.png');

  // 6. novatech_de_pdp_live.png (FlowShop DE PDP)
  console.log('6. Capturing novatech_de_pdp_live.png...');
  await page.goto('http://localhost:5000/demo-shop?lang=de', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await saveScreenshot('novatech_de_pdp_live.png');

  // 7. novatech_de_home_live.png (FlowShop DE Home)
  console.log('7. Capturing novatech_de_home_live.png...');
  await saveScreenshot('novatech_de_home_live.png');

  // 8. novatech_de_search_live.png (FlowShop DE Search)
  console.log('8. Capturing novatech_de_search_live.png...');
  await page.fill('#search-input', 'Noise-Cancelling-Kopfhörer');
  await page.waitForTimeout(300);
  await saveScreenshot('novatech_de_search_live.png');

  // 9. novatech_de_cart_live.png (FlowShop DE Cart Drawer)
  console.log('9. Capturing novatech_de_cart_live.png...');
  await page.click('#btn-add-to-cart');
  await page.waitForTimeout(400);
  await page.fill('#coupon-input', 'SAVE20');
  await page.click('#btn-apply-coupon');
  await page.waitForTimeout(400);
  await saveScreenshot('novatech_de_cart_live.png');

  // 10. novatech_de_checkout_live.png (FlowShop DE Checkout)
  console.log('10. Capturing novatech_de_checkout_live.png...');
  await page.click('#btn-to-checkout');
  await page.waitForTimeout(500);
  await saveScreenshot('novatech_de_checkout_live.png');

  // 11. novatech_de_plp_live.png (FlowShop DE Catalog)
  console.log('11. Capturing novatech_de_plp_live.png...');
  await page.goto('http://localhost:5000/demo-shop?lang=de', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = document.getElementById('related-title');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(400);
  await saveScreenshot('novatech_de_plp_live.png');

  // 12. novatech_de_auth_live.png & novatech_de_rma_live.png
  console.log('12. Capturing novatech_de_auth_live.png & rma...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    if (typeof openCheckoutModal === 'function') openCheckoutModal();
  });
  await page.waitForTimeout(400);
  await saveScreenshot('novatech_de_auth_live.png');

  // Trigger order confirmation
  await page.evaluate(() => {
    if (typeof acceptUpsell === 'function') acceptUpsell();
  });
  await page.waitForTimeout(500);
  await saveScreenshot('novatech_de_rma_live.png');

  // Also update all run-* thumbnails so no monster remnants exist anywhere in the pipeline runs
  console.log('Updating all run-* screenshot files...');
  const files = fs.readdirSync(clientScreenshotsDir);
  for (const f of files) {
    if (f.startsWith('run-')) {
      const target = path.join(clientScreenshotsDir, f);
      const serverTarget = path.join(serverScreenshotsDir, f);
      let source = path.join(clientScreenshotsDir, 'novatech_home_live.png');
      if (f.includes('pdp')) source = path.join(clientScreenshotsDir, 'novatech_pdp.png');
      else if (f.includes('cart')) source = path.join(clientScreenshotsDir, 'novatech_cart_live.png');
      else if (f.includes('checkout') || f.includes('payment')) source = path.join(clientScreenshotsDir, 'novatech_checkout_live.png');
      else if (f.includes('search') || f.includes('category')) source = path.join(clientScreenshotsDir, 'novatech_category.png');
      
      fs.copyFileSync(source, target);
      fs.copyFileSync(source, serverTarget);
    }
  }

  await browser.close();
  console.log('=== ALL FLOWSHOP AUDIO STOREFRONT SCREENSHOTS CAPTURED SUCCESSFULLY ===');
}

captureAllStorefronts().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
