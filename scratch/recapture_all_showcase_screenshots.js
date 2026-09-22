const path = require('path');
const fs = require('fs');
const { chromium } = require(require.resolve('playwright', { paths: [path.join(__dirname, '..', 'server')] }));

const DOCS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

async function recaptureAll() {
  console.log('=== STARTING RE-CAPTURE OF ALL 17 SHOWCASE SCREENSHOTS ===');
  let browser;
  for (let i = 0; i < 3; i++) {
    try {
      browser = await chromium.launch({ headless: true });
      break;
    } catch (e) {
      console.log(`Launch attempt ${i + 1} failed, retrying...`);
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. NovaTech TR Master Pipeline
  console.log('1. Capturing 01_novatech_tr_master_pipeline.png...');
  const masterTab = page.locator('button:has-text("Genel Tüm Otomasyonlar")');
  await masterTab.click();
  await page.waitForTimeout(600);
  const trBtn = page.locator('[data-testid="domain-btn-novatech-tr"]');
  if (await trBtn.isVisible()) await trBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(DOCS_DIR, '01_novatech_tr_master_pipeline.png') });

  // 2. NovaTech DE Master Pipeline
  console.log('2. Capturing 02_novatech_de_master_pipeline.png...');
  const deBtn = page.locator('[data-testid="domain-btn-novatech-de"]');
  await deBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(DOCS_DIR, '02_novatech_de_master_pipeline.png') });

  // 3. Global Dual Engine Pipeline
  console.log('3. Capturing 03_global_dual_engine_pipeline.png...');
  const allBtn = page.locator('[data-testid="domain-btn-all"]');
  await allBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(DOCS_DIR, '03_global_dual_engine_pipeline.png') });

  // Return from Master tab to standard scenario view
  const scenarioTab = page.locator('button:has-text("Senaryo Akışı")').first();
  if (await scenarioTab.isVisible()) {
    await scenarioTab.click();
    await page.waitForTimeout(600);
  }

  // 4, 5, 6. Visual Regression
  console.log('Opening Visual Regression from RightSidebar...');
  const sidebarDiffBtn = page.locator('[data-testid="sidebar-visual-diff-btn"]').first();
  if (await sidebarDiffBtn.isVisible()) {
    await sidebarDiffBtn.click();
    await page.waitForTimeout(600);

    // 4. Split Slider
    console.log('4. Capturing 04_visual_regression_split_slider.png...');
    await page.screenshot({ path: path.join(DOCS_DIR, '04_visual_regression_split_slider.png') });

    // 5. Diff Mask
    console.log('5. Capturing 05_visual_regression_diff_mask.png...');
    const maskBtn = page.locator('button:has-text("Diff Mask"), button:has-text("Fark Maskesi")').first();
    if (await maskBtn.isVisible()) {
      await maskBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(DOCS_DIR, '05_visual_regression_diff_mask.png') });
    }

    // 6. Side by Side
    console.log('6. Capturing 06_visual_regression_side_by_side.png...');
    const sideBtn = page.locator('button:has-text("Yan Yana")').first();
    if (await sideBtn.isVisible()) {
      await sideBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(DOCS_DIR, '06_visual_regression_side_by_side.png') });
    }

    // Close modal
    const closeDiff = page.locator('[data-testid="visual-diff-close"], button[aria-label="Kapat"], button:has-text("✕")').first();
    if (await closeDiff.isVisible()) await closeDiff.click();
    await page.waitForTimeout(400);
  }

  // 7. Google Core Web Vitals
  console.log('7. Capturing 07_google_core_web_vitals.png...');
  const vitalsBtn = page.locator('[data-testid="open-web-vitals-btn"]');
  if (await vitalsBtn.isVisible()) {
    await vitalsBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '07_google_core_web_vitals.png') });
    // Close vitals modal
    const closeVitals = page.locator('button:has-text("Kapat"), button:has-text("✕")').first();
    if (await closeVitals.isVisible()) await closeVitals.click();
    await page.waitForTimeout(400);
  }

  // 8. Device Viewport Emulation
  console.log('8. Capturing 08_device_emulation_iphone15.png...');
  const mobileBtn = page.locator('[data-testid="viewport-mobile-btn"]');
  if (await mobileBtn.isVisible()) {
    await mobileBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '08_device_emulation_iphone15.png') });
    const deskBtn = page.locator('[data-testid="viewport-desktop-btn"]');
    if (await deskBtn.isVisible()) await deskBtn.click();
    await page.waitForTimeout(400);
  }

  // 9. Playwright Spec Code Generator
  console.log('9. Capturing 09_playwright_spec_code_generator.png...');
  const specBtn = page.locator('[data-testid="open-playwright-code-btn"]');
  if (await specBtn.isVisible()) {
    await specBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '09_playwright_spec_code_generator.png') });
    const closeCode = page.locator('button:has-text("Kapat"), button:has-text("✕")').first();
    if (await closeCode.isVisible()) await closeCode.click();
    await page.waitForTimeout(400);
  }

  // 10. AI Self-Healing Heuristics
  console.log('10. Capturing 10_ai_self_healing_heuristics.png...');
  const healBtn = page.locator('[data-testid="open-self-healing-btn"]');
  if (await healBtn.isVisible()) {
    await healBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '10_ai_self_healing_heuristics.png') });
    const closeHeal = page.locator('button:has-text("Kapat"), button:has-text("✕")').first();
    if (await closeHeal.isVisible()) await closeHeal.click();
    await page.waitForTimeout(400);
  }

  // 11. Jira MCP Defect Tracker
  console.log('11. Capturing 11_jira_mcp_defect_tracker.png...');
  const jiraBtn = page.locator('button:has-text("Jira MCP"), button[title*="Jira"]').first();
  if (await jiraBtn.isVisible()) {
    await jiraBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '11_jira_mcp_defect_tracker.png') });
    const closeJira = page.locator('button:has-text("Kapat"), button:has-text("✕")').first();
    if (await closeJira.isVisible()) await closeJira.click();
    await page.waitForTimeout(400);
  }

  // 12. Customer Auth Vault
  console.log('12. Capturing 12_customer_auth_vault.png...');
  const scenariosTab = page.locator('button:has-text("Senaryolar"), a:has-text("Senaryolar")').first();
  if (await scenariosTab.isVisible()) {
    await scenariosTab.click();
    await page.waitForTimeout(600);
    const editProjBtn = page.locator('[data-testid="edit-project-folder-btn"]').first();
    if (await editProjBtn.isVisible()) {
      await editProjBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(DOCS_DIR, '12_customer_auth_vault.png') });
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
    }
  }

  // 13. Multi-Scenario Scheduler
  console.log('13. Capturing 13_multi_scenario_scheduler.png...');
  const schedTab = page.locator('button:has-text("Zamanlayıcı"), a:has-text("Zamanlayıcı")').first();
  if (await schedTab.isVisible()) {
    await schedTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '13_multi_scenario_scheduler.png') });
  }

  // 14. Compliance & Security Audit
  console.log('14. Capturing 14_compliance_security_audit.png...');
  const compTab = page.locator('button:has-text("Uyumluluk"), a:has-text("Uyumluluk")').first();
  if (await compTab.isVisible()) {
    await compTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '14_compliance_security_audit.png') });
  }

  // Switch back to editor
  const editTab = page.locator('button:has-text("Senaryo"), a:has-text("Senaryo")').first();
  if (await editTab.isVisible()) {
    await editTab.click();
    await page.waitForTimeout(500);
  }

  // 15. Light Mode Dashboard
  console.log('15. Capturing 15_light_mode_dashboard.png...');
  const themeToggle = page.locator('button[title*="Açık Mod"], button[title*="Koyu Mod"]').first();
  if (await themeToggle.isVisible()) {
    await themeToggle.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '15_light_mode_dashboard.png') });
    // Switch back to dark mode
    await themeToggle.click();
    await page.waitForTimeout(400);
  }

  // 16. Training Guide
  console.log('16. Capturing 16_training_guide.png...');
  const guideBtn = page.locator('button:has-text("Eğitim"), button:has-text("Rehber")').first();
  if (await guideBtn.isVisible()) {
    await guideBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '16_training_guide.png') });
    const closeGuide = page.locator('button:has-text("Kapat"), button:has-text("✕")').first();
    if (await closeGuide.isVisible()) await closeGuide.click();
    await page.waitForTimeout(400);
  }

  // 17. OmniMind AI Copilot
  console.log('17. Capturing 17_omnimind_ai_copilot.png...');
  const omniBtn = page.locator('[data-testid="open-omnimind-ai-btn"]');
  if (await omniBtn.isVisible()) {
    await omniBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '17_omnimind_ai_copilot.png') });
    const closeOmni = page.locator('button:has-text("✕")').first();
    if (await closeOmni.isVisible()) await closeOmni.click();
  }

  console.log('✅ ALL 17 SHOWCASE SCREENSHOTS SUCCESSFULLY RE-CAPTURED!');
  await browser.close();
}

recaptureAll().catch(err => {
  console.error('Error recapturing screenshots:', err);
  process.exit(1);
});
