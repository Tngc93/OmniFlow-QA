const path = require('path');
const { chromium } = require(require.resolve('playwright', { paths: [path.join(__dirname, '..', 'server')] }));
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/BERK.ARCAK/.gemini/antigravity/brain/84aa1859-793a-450d-9ba7-d9c7a6265edd';

async function run() {
  console.log('=== STARTING VERIFICATION FOR NEW FEATURES ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  const networkWarnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[Browser Console Error]', msg.text());
      consoleErrors.push(msg.text());
    }
  });

  page.on('response', res => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      console.warn(`[HTTP ${res.status()}]`, res.url());
      networkWarnings.push({ status: res.status(), url: res.url() });
    }
  });

  try {
    // 1. Load Dashboard
    console.log('--- 1. Loading Dashboard on http://localhost:5000 ---');
    await page.goto('http://localhost:5000', { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    // 2. Test Device Viewport Emulation
    console.log('--- 2. Testing Device Viewport Emulation ---');
    const mobileBtn = page.locator('[data-testid="viewport-mobile-btn"]');
    await mobileBtn.click();
    await page.waitForTimeout(500);

    // Verify emulation banner is visible
    const emulationText = await page.locator('text=RESPONSIVE EMULATION:').isVisible();
    console.log('Mobile Emulation Banner Visible:', emulationText);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'feat_14_device_emulation_iphone.png'), fullPage: false });

    // Tablet button
    const tabletBtn = page.locator('[data-testid="viewport-tablet-btn"]');
    await tabletBtn.click();
    await page.waitForTimeout(400);

    // Return to Desktop
    const desktopBtn = page.locator('[data-testid="viewport-desktop-btn"]');
    await desktopBtn.click();
    await page.waitForTimeout(400);

    // 3. Test Google Core Web Vitals & Lighthouse Modal
    console.log('--- 3. Testing Google Core Web Vitals & Lighthouse Modal ---');
    const webVitalsBtn = page.locator('[data-testid="open-web-vitals-btn"]').first();
    await webVitalsBtn.click();
    await page.waitForSelector('text=Google Core Web Vitals & Lighthouse', { timeout: 5000 });
    await page.waitForTimeout(600);

    // Capture Monster TR Web Vitals
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'feat_15_web_vitals_monster.png'), fullPage: false });

    // Switch to Tulpar DE in Web Vitals Modal
    const tulparToggle = page.locator('button:has-text("Tulpar DE")').first();
    await tulparToggle.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'feat_16_web_vitals_tulpar.png'), fullPage: false });

    // Test Refresh Button
    const refreshBtn = page.locator('button:has-text("Yenile"), button:has-text("Refresh")').first();
    await refreshBtn.click();
    await page.waitForTimeout(1500); // wait for auditing animation

    // Close Web Vitals Modal
    const closeVitalsBtn = page.locator('[data-testid="web-vitals-modal-close"]').first();
    await closeVitalsBtn.click();
    await page.waitForTimeout(500);

    // 4. Test Visual Regression & Pixel-Diff Modal
    console.log('--- 4. Testing Visual Regression & Pixel-Diff Modal ---');
    // Open from RightSidebar
    const sidebarDiffBtn = page.locator('[data-testid="sidebar-visual-diff-btn"]').first();
    await sidebarDiffBtn.click();
    await page.waitForSelector('text=Görsel Regresyon', { timeout: 5000 });
    await page.waitForTimeout(600);

    // 4a. Split Slider Mode Screenshot
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'feat_17_visual_regression_slider.png'), fullPage: false });

    // 4b. Switch to Diff Mask Mode
    const diffMaskBtn = page.locator('button:has-text("Diff Mask")').first();
    await diffMaskBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'feat_18_visual_regression_diff_mask.png'), fullPage: false });

    // 4c. Switch to Side-by-Side Mode
    const sideBySideBtn = page.locator('button:has-text("Yan Yana")').first();
    await sideBySideBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'feat_19_visual_regression_side_by_side.png'), fullPage: false });

    // 4d. Test Update as New Baseline
    const updateBaselineBtn = page.locator('button:has-text("Yeni Referans")').first();
    await updateBaselineBtn.click();
    await page.waitForTimeout(500);

    // Close Visual Regression Modal
    const closeDiffBtn = page.locator('[data-testid="visual-diff-close"]').first();
    await closeDiffBtn.click();
    await page.waitForTimeout(500);

    // 5. Test Node Context Menu Visual Regression option
    console.log('--- 5. Testing Node Context Menu -> Visual Regression ---');
    const nodeMoreBtn = page.locator('[data-testid="node-more-btn"]').first();
    await nodeMoreBtn.click();
    await page.waitForTimeout(300);

    const nodeVisualDiffBtn = page.locator('button:has-text("Görsel Regresyon (Piksel-Diff)")').first();
    const isNodeDiffVisible = await nodeVisualDiffBtn.isVisible();
    console.log('Node Context Menu Visual Diff Button Visible:', isNodeDiffVisible);

    await nodeVisualDiffBtn.click();
    await page.waitForTimeout(600);
    // Close it via ESC
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);

    // 6. Test GET /api/vitals API directly
    console.log('--- 6. Testing GET /api/vitals API ---');
    const apiRes = await page.request.get('http://localhost:5000/api/vitals');
    const vitalsJson = await apiRes.json();
    console.log('API /api/vitals status:', apiRes.status(), 'Global Score:', vitalsJson.globalScore);

    console.log('\n=== VERIFICATION RESULTS ===');
    console.log('Console Errors:', consoleErrors.length);
    console.log('Network Warnings:', networkWarnings.length);

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'new_features_audit.json'), JSON.stringify({
      timestamp: new Date().toISOString(),
      mobileEmulation: emulationText,
      vitalsApiStatus: apiRes.status(),
      globalScore: vitalsJson.globalScore,
      nodeDiffVisible: isNodeDiffVisible,
      consoleErrors,
      networkWarnings
    }, null, 2));

  } catch (err) {
    console.error('Test failed with error:', err);
  } finally {
    await browser.close();
  }
}

run();
