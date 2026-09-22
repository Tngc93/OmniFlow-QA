import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const artifactDir = 'C:\\Users\\BERK.ARCAK\\.gemini\\antigravity\\brain\\84aa1859-793a-450d-9ba7-d9c7a6265edd';

async function verifyUI() {
  console.log('[QA Verify] Launching Playwright browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('[QA Verify] Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // 1. Check title & brand
  const pageText = await page.textContent('body');
  console.log('[QA Verify] OmniFlow QA found:', pageText.includes('OmniFlow'));

  // Take screenshot of initial Dashboard (CAD Blueprint background in Light mode)
  await page.screenshot({ path: path.join(artifactDir, 'ui_01_dashboard_cad.png') });
  console.log('[QA Verify] Saved ui_01_dashboard_cad.png');

  // 2. Test clicking Scenarios catalog
  console.log('[QA Verify] Clicking Scenarios menu item...');
  const scenariosBtn = page.locator('button:has-text("Test Senaryoları"), button:has-text("Scenarios")').first();
  await scenariosBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, 'ui_02_scenarios_catalog.png') });
  console.log('[QA Verify] Saved ui_02_scenarios_catalog.png');

  // 3. Test clicking Compliance
  console.log('[QA Verify] Clicking Compliance menu item...');
  const complianceBtn = page.locator('button:has-text("Güvenlik & Uyumluluk"), button:has-text("Compliance")').first();
  await complianceBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, 'ui_03_compliance_view.png') });
  console.log('[QA Verify] Saved ui_03_compliance_view.png');

  // 4. Test toggling Dark Mode
  console.log('[QA Verify] Toggling Dark Mode...');
  const themeToggle = page.locator('button[data-testid="theme-toggle"]');
  await themeToggle.click();
  await page.waitForTimeout(500);

  // Return to Dashboard to see high-tech dark CAD canvas
  const dashboardBtn = page.locator('button:has-text("Kontrol Paneli"), button:has-text("Dashboard")').first();
  await dashboardBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, 'ui_04_dark_cad_canvas.png') });
  console.log('[QA Verify] Saved ui_04_dark_cad_canvas.png');

  // 5. Test Language Switcher to EN
  console.log('[QA Verify] Toggling Language to English...');
  const langToggle = page.locator('button[data-testid="lang-toggle"]');
  await langToggle.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, 'ui_05_dark_english.png') });
  console.log('[QA Verify] Saved ui_05_dark_english.png');

  // 6. Test Settings view in English
  console.log('[QA Verify] Clicking Settings in sidebar...');
  const settingsBtn = page.locator('button:has-text("System Settings"), button:has-text("Sistem Ayarları")').first();
  await settingsBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(artifactDir, 'ui_06_settings_view.png') });
  console.log('[QA Verify] Saved ui_06_settings_view.png');

  await browser.close();
  console.log('[QA Verify] All UI verification steps successfully completed!');
}

verifyUI().catch(err => {
  console.error('[QA Verify Error]', err);
  process.exit(1);
});
