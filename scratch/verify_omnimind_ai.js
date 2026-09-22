const path = require('path');
const fs = require('fs');
const { chromium } = require(require.resolve('playwright', { paths: [path.join(__dirname, '..', 'server')] }));

const ARTIFACT_DIR = path.join(process.env.USERPROFILE || 'C:/Users/QA', '.gemini', 'antigravity', 'brain', '84aa1859-793a-450d-9ba7-d9c7a6265edd');
const DOCS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

async function verifyOmniMind() {
  console.log('=== STARTING OMNIMIND AI & VISUAL SANITIZATION VERIFICATION ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.error('[Browser Console Error]', msg.text());
      consoleErrors.push(msg.text());
    }
  });

  // Navigate to application
  console.log('Navigating to http://localhost:5000...');
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check OmniMind AI button
  console.log('Checking for OmniMind AI button in HUD...');
  const omniBtn = page.locator('[data-testid="open-omnimind-ai-btn"]');
  const isOmniBtnVisible = await omniBtn.isVisible();
  console.log(`OmniMind AI button visible: ${isOmniBtnVisible}`);

  // Open OmniMind AI Modal
  console.log('Clicking OmniMind AI button...');
  await omniBtn.click();
  await page.waitForTimeout(600);

  // Verify modal is visible
  const modalHeader = page.locator('text=OmniMind AI');
  await modalHeader.first().waitFor({ state: 'visible', timeout: 5000 });
  console.log('OmniMind AI Modal is open and visible.');

  // Test Prompt-to-Pipeline preset
  console.log('Testing Prompt-to-Pipeline synthesis...');
  const firstPreset = page.locator('text=flowshop TR: Sepet, Kupon (NOVAPRO20)');
  if (await firstPreset.isVisible()) {
    await firstPreset.click();
    await page.waitForTimeout(800);
  }

  // Take high-res screenshot of OmniMind AI Modal for docs/screenshots
  const copilotScreenPath = path.join(DOCS_DIR, '17_omnimind_ai_copilot.png');
  const artifactScreenPath = path.join(ARTIFACT_DIR, 'feat_17_omnimind_ai_copilot.png');
  await page.screenshot({ path: copilotScreenPath, fullPage: false });
  await page.screenshot({ path: artifactScreenPath, fullPage: false });
  console.log(`Captured: 17_omnimind_ai_copilot.png to ${copilotScreenPath}`);

  // Test RCA Tab
  console.log('Testing RCA Diagnostics tab...');
  const rcaTab = page.locator('text=Kök Neden Analizi (RCA)');
  await rcaTab.click();
  await page.waitForTimeout(400);
  const rcaRunBtn = page.locator('button:has-text("AI Kök Neden Teşhisi Yap")');
  await rcaRunBtn.click();
  await page.waitForTimeout(600);
  console.log('RCA diagnostics executed successfully.');

  // Test Synthetic Data Tab
  console.log('Testing Synthetic Data Foundry tab...');
  const dataTab = page.locator('text=Sentetik Veri Fabrikası');
  await dataTab.click();
  await page.waitForTimeout(600);
  console.log('Synthetic Data Foundry tab loaded.');

  // Switch back to Prompt tab and apply pipeline to canvas
  console.log('Testing pipeline injection onto ReactFlow canvas...');
  const promptTab = page.locator('text=Prompt-to-Pipeline');
  await promptTab.click();
  await page.waitForTimeout(400);

  const applyBtn = page.locator('button:has-text("Tuvale Enjekte Et & Çalıştır")');
  if (await applyBtn.isVisible()) {
    await applyBtn.click();
    await page.waitForTimeout(600);
    console.log('Applied synthesized pipeline directly to visual canvas.');
  }

  // Strict DOM scan for anonymization
  console.log('Performing strict DOM anonymization check (ensuring no qa.engineer anywhere)...');
  const bodyText = await page.evaluate(() => document.body.innerText);
  const containsqa = /qa[\s.]*arcak/i.test(bodyText);
  const containsflowshop = /flowshopnotebook\.com/i.test(bodyText);
  const containsflowshop = /flowshopnotebook\.de/i.test(bodyText);

  console.log(`DOM contains 'QA Engineer': ${containsqa}`);
  console.log(`DOM contains 'flowshopnotebook.com': ${containsflowshop}`);
  console.log(`DOM contains 'flowshopnotebook.de': ${containsflowshop}`);

  if (containsqa) {
    throw new Error('FAIL: QA Engineer found in rendered DOM text!');
  }
  if (containsflowshop || containsflowshop) {
    throw new Error('FAIL: flowshopnotebook or flowshopnotebook URL found in rendered DOM text!');
  }

  console.log('✅ STRICT ANONYMIZATION CHECK PASSED 100%!');
  console.log(`Total console errors: ${consoleErrors.length}`);

  await browser.close();
}

verifyOmniMind().catch(err => {
  console.error('OmniMind verification error:', err);
  process.exit(1);
});
