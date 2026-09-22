const path = require('path');
const { chromium } = require(require.resolve('playwright', { paths: [path.join(__dirname, '..', 'server')] }));
const fs = require('fs');

async function main() {
  const artifactDir = 'C:\\Users\\BERK.ARCAK\\.gemini\\antigravity\\brain\\84aa1859-793a-450d-9ba7-d9c7a6265edd';
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173 ...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Switch to "Genel Tüm Otomasyonlar" tab
  console.log('Switching to Genel Tüm Otomasyonlar tab...');
  const masterTab = page.locator('button:has-text("Genel Tüm Otomasyonlar")');
  await masterTab.click();
  await page.waitForTimeout(1500);

  // 1. Check Monster TR
  console.log('Selecting monsternotebook.com.tr...');
  const monsterTrBtn = page.locator('[data-testid="domain-btn-monster-tr"]');
  if (await monsterTrBtn.isVisible()) {
    await monsterTrBtn.click();
    await page.waitForTimeout(1000);
  }

  // Zoom/Fit view if available or capture screenshot of Monster TR
  const fitViewBtn = page.locator('.react-flow__controls-fitview');
  if (await fitViewBtn.isVisible()) {
    await fitViewBtn.click();
    await page.waitForTimeout(1000);
  }

  const screen1 = path.join(artifactDir, 'feat_10_monster_tr_master_screens.png');
  await page.screenshot({ path: screen1 });
  console.log('Saved feat_10_monster_tr_master_screens.png');

  // 2. Switch to Tulpar DE
  console.log('Selecting tulparnotebook.de...');
  const tulparDeBtn = page.locator('[data-testid="domain-btn-tulpar-de"]');
  await tulparDeBtn.click();
  await page.waitForTimeout(1500);

  if (await fitViewBtn.isVisible()) {
    await fitViewBtn.click();
    await page.waitForTimeout(1000);
  }

  const screen2 = path.join(artifactDir, 'feat_11_tulpar_de_master_authentic_screens.png');
  await page.screenshot({ path: screen2 });
  console.log('Saved feat_11_tulpar_de_master_authentic_screens.png');

  // 3. Test clicking a screenshot thumbnail to open modal
  console.log('Clicking screenshot thumbnail on Tulpar node...');
  const thumbnail = page.locator('[data-testid="node-screenshot-thumb"]').first();
  if (await thumbnail.isVisible({ timeout: 5000 }).catch(() => false)) {
    await thumbnail.click({ force: true });
    await page.waitForTimeout(1500);

    const screen3 = path.join(artifactDir, 'feat_12_tulpar_screenshot_modal.png');
    await page.screenshot({ path: screen3 });
    console.log('Saved feat_12_tulpar_screenshot_modal.png');

    // Close modal by clicking close button
    const closeBtn = page.locator('[data-testid="modal-close-btn"]');
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(1000);
    } else {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
    }
  } else {
    console.log('No thumbnail found to click');
  }

  // 4. Switch to Global E2E (TR & DE)
  console.log('Selecting Global E2E (TR & DE)...');
  const globalBtn = page.locator('[data-testid="domain-btn-all"]');
  await globalBtn.waitFor({ state: 'visible', timeout: 5000 });
  await globalBtn.click();
  await page.waitForTimeout(1500);

  if (await fitViewBtn.isVisible()) {
    await fitViewBtn.click();
    await page.waitForTimeout(1000);
  }

  const screen4 = path.join(artifactDir, 'feat_13_global_dual_engine_pipeline.png');
  await page.screenshot({ path: screen4 });
  console.log('Saved feat_13_global_dual_engine_pipeline.png');

  console.log('All verifications complete successfully!');
  await browser.close();
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
