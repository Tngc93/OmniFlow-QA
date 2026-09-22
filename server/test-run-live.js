import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const artifactDir = path.join(process.env.USERPROFILE || 'C:/Users/QA', '.gemini', 'antigravity', 'brain', '84aa1859-793a-450d-9ba7-d9c7a6265edd');

async function testLiveRunFromUI() {
  console.log('[QA Verify Live] Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('[QA Verify Live] Loading app...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // Click Run Automation in Header
  console.log('[QA Verify Live] Clicking "Run Automation"...');
  const runBtn = page.locator('button:has-text("Run Automation"), button:has-text("Otomasyonu Başlat")').first();
  await runBtn.click();

  // Wait 3 seconds for active running state
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(artifactDir, 'ui_07_live_running_state.png') });
  console.log('[QA Verify Live] Captured ui_07_live_running_state.png');

  // Wait for run completion (up to 30s)
  console.log('[QA Verify Live] Waiting for automation execution to finish...');
  await page.waitForFunction(() => {
    const btn = document.querySelector('header button');
    return !document.body.innerText.includes('Running...') && !document.body.innerText.includes('Çalışıyor...');
  }, { timeout: 35000 });

  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'ui_08_live_completed_state.png') });
  console.log('[QA Verify Live] Captured ui_08_live_completed_state.png');

  await browser.close();
  console.log('[QA Verify Live] Test run completed successfully!');
}

testLiveRunFromUI().catch(err => {
  console.error('[QA Verify Live Error]', err);
  process.exit(1);
});
