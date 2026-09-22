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

  // 1. flowshop_pdp.png (English FlowShop PDP - Authentic audio gear e-commerce)
  console.log('1. Capturing flowshop_pdp.png...');
  await page.goto('http://localhost:5000/demo-shop', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await saveScreenshot('flowshop_pdp.png');

  // 2. flowshop_home_live.png (FlowShop Storefront / Hero)
  console.log('2. Capturing flowshop_home_live.png...');
  await saveScreenshot('flowshop_home_live.png');

  // 3. flowshop_cart_live.png (Cart Drawer open with SAVE20 applied)
  console.log('3. Capturing flowshop_cart_live.png...');
  await page.click('#btn-add-to-cart');
  await page.waitForTimeout(400);
  await page.fill('#coupon-input', 'SAVE20');
  await page.click('#btn-apply-coupon');
  await page.waitForTimeout(400);
  await saveScreenshot('flowshop_cart_live.png');

  // 4. flowshop_checkout_live.png (Checkout Modal open)
  console.log('4. Capturing flowshop_checkout_live.png...');
  await page.click('#btn-to-checkout');
  await page.waitForTimeout(500);
  await saveScreenshot('flowshop_checkout_live.png');

  // Close checkout modal
  await page.evaluate(() => {
    if (typeof closeCheckoutModal === 'function') closeCheckoutModal();
    if (typeof toggleCart === 'function') toggleCart(false);
  });
  await page.waitForTimeout(300);

  // 5. flowshop_category.png (Audio Devices & Catalog View)
  console.log('5. Capturing flowshop_category.png...');
  await page.goto('http://localhost:5000/demo-shop', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = document.getElementById('related-title');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(400);
  await saveScreenshot('flowshop_category.png');

  // 6. flowshop_de_pdp_live.png (FlowShop DE PDP)
  console.log('6. Capturing flowshop_de_pdp_live.png...');
  await page.goto('http://localhost:5000/demo-shop?lang=de', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await saveScreenshot('flowshop_de_pdp_live.png');

  // 7. flowshop_de_home_live.png (FlowShop DE Home)
  console.log('7. Capturing flowshop_de_home_live.png...');
  await saveScreenshot('flowshop_de_home_live.png');

  // 8. flowshop_de_search_live.png (FlowShop DE Search)
  console.log('8. Capturing flowshop_de_search_live.png...');
  await page.fill('#search-input', 'Noise-Cancelling-Kopfhörer');
  await page.waitForTimeout(300);
  await saveScreenshot('flowshop_de_search_live.png');

  // 9. flowshop_de_cart_live.png (FlowShop DE Cart Drawer)
  console.log('9. Capturing flowshop_de_cart_live.png...');
  await page.click('#btn-add-to-cart');
  await page.waitForTimeout(400);
  await page.fill('#coupon-input', 'SAVE20');
  await page.click('#btn-apply-coupon');
  await page.waitForTimeout(400);
  await saveScreenshot('flowshop_de_cart_live.png');

  // 10. flowshop_de_checkout_live.png (FlowShop DE Checkout)
  console.log('10. Capturing flowshop_de_checkout_live.png...');
  await page.click('#btn-to-checkout');
  await page.waitForTimeout(500);
  await saveScreenshot('flowshop_de_checkout_live.png');

  // 11. flowshop_de_plp_live.png (FlowShop DE Catalog)
  console.log('11. Capturing flowshop_de_plp_live.png...');
  await page.goto('http://localhost:5000/demo-shop?lang=de', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    const el = document.getElementById('related-title');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await page.waitForTimeout(400);
  await saveScreenshot('flowshop_de_plp_live.png');

  // 12. flowshop_de_auth_live.png & flowshop_de_rma_live.png
  console.log('12. Capturing flowshop_de_auth_live.png & rma...');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    if (typeof openCheckoutModal === 'function') openCheckoutModal();
  });
  await page.waitForTimeout(400);
  await saveScreenshot('flowshop_de_auth_live.png');

  // Trigger order confirmation
  await page.evaluate(() => {
    if (typeof acceptUpsell === 'function') acceptUpsell();
  });
  await page.waitForTimeout(500);
  await saveScreenshot('flowshop_de_rma_live.png');

  // Update all run-* thumbnails so they use FlowShop mock screenshots
  console.log('Updating all run-* screenshot files...');
  const files = fs.readdirSync(clientScreenshotsDir);
  for (const f of files) {
    if (f.startsWith('run-')) {
      const target = path.join(clientScreenshotsDir, f);
      const serverTarget = path.join(serverScreenshotsDir, f);
      let source = path.join(clientScreenshotsDir, 'flowshop_home_live.png');
      if (f.includes('pdp')) source = path.join(clientScreenshotsDir, 'flowshop_pdp.png');
      else if (f.includes('cart')) source = path.join(clientScreenshotsDir, 'flowshop_cart_live.png');
      else if (f.includes('checkout') || f.includes('payment')) source = path.join(clientScreenshotsDir, 'flowshop_checkout_live.png');
      else if (f.includes('search') || f.includes('category')) source = path.join(clientScreenshotsDir, 'flowshop_category.png');
      
      fs.copyFileSync(source, target);
      fs.copyFileSync(source, serverTarget);
    }
  }

  // Remove legacy flowshop_*.png files
  console.log('Cleaning up old flowshop_*.png files...');
  for (const dir of [clientScreenshotsDir, serverScreenshotsDir]) {
    const list = fs.readdirSync(dir);
    for (const f of list) {
      if (f.startsWith('flowshop_')) {
        fs.unlinkSync(path.join(dir, f));
      }
    }
  }

  await browser.close();
  console.log('=== ALL FLOWSHOP AUDIO STOREFRONT SCREENSHOTS CAPTURED SUCCESSFULLY ===');
}

captureAllStorefronts().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
