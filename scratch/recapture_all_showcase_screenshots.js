const path = require('path');
const fs = require('fs');
const { chromium } = require(require.resolve('playwright', { paths: [path.join(__dirname, '..', 'server')] }));

const DOCS_DIR = path.join(__dirname, '..', 'docs', 'screenshots');
if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });

async function recaptureAll() {
  console.log('=== STARTING RE-CAPTURE OF ALL 17 SHOWCASE SCREENSHOTS IN ENGLISH ===');
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

  // Load app (port 5000 serves built client)
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Force language to English & Dark Theme in localStorage
  await page.evaluate(() => {
    localStorage.setItem('omniflow_lang', 'en');
    localStorage.setItem('omniflow_theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. FlowShop TR Master Pipeline
  console.log('1. Capturing 01_flowshop_tr_master_pipeline.png...');
  const masterTab = page.locator('[data-testid="tab-master-pipeline"]').first();
  if (await masterTab.isVisible()) await masterTab.click();
  await page.waitForTimeout(400);
  const trBtn = page.locator('[data-testid="domain-btn-flowshop-tr"]').first();
  if (await trBtn.isVisible()) await trBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(DOCS_DIR, '01_flowshop_tr_master_pipeline.png') });

  // 2. FlowShop DE Master Pipeline
  console.log('2. Capturing 02_flowshop_de_master_pipeline.png...');
  const deBtn = page.locator('[data-testid="domain-btn-flowshop-de"]').first();
  if (await deBtn.isVisible()) await deBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(DOCS_DIR, '02_flowshop_de_master_pipeline.png') });

  // 3. Global Dual Engine Pipeline
  console.log('3. Capturing 03_global_dual_engine_pipeline.png...');
  const allBtn = page.locator('[data-testid="domain-btn-all"]').first();
  if (await allBtn.isVisible()) await allBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(DOCS_DIR, '03_global_dual_engine_pipeline.png') });

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
    const maskBtn = page.locator('button:has-text("Pixel Mask"), button:has-text("Diff Mask")').first();
    if (await maskBtn.isVisible()) {
      await maskBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(DOCS_DIR, '05_visual_regression_diff_mask.png') });
    }

    // 6. Side by Side
    console.log('6. Capturing 06_visual_regression_side_by_side.png...');
    const sideBtn = page.locator('button:has-text("Side-by-Side"), button:has-text("Yan Yana")').first();
    if (await sideBtn.isVisible()) {
      await sideBtn.click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: path.join(DOCS_DIR, '06_visual_regression_side_by_side.png') });
    }

    // Close modal
    const closeDiff = page.locator('[data-testid="visual-diff-close"], button:has-text("Close"), button:has-text("Kapat")').first();
    if (await closeDiff.isVisible()) await closeDiff.click();
    await page.waitForTimeout(400);
  }

  // 7. Google Core Web Vitals
  console.log('7. Capturing 07_google_core_web_vitals.png...');
  const vitalsBtn = page.locator('[data-testid="open-web-vitals-btn"]').first();
  if (await vitalsBtn.isVisible()) {
    await vitalsBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '07_google_core_web_vitals.png') });
    const closeVitals = page.locator('[data-testid="web-vitals-modal-close"], button:has-text("Close"), button:has-text("Kapat")').first();
    if (await closeVitals.isVisible()) await closeVitals.click();
    await page.waitForTimeout(400);
  }

  // 8. Device Viewport Emulation
  console.log('8. Capturing 08_device_emulation_iphone15.png...');
  const mobileBtn = page.locator('[data-testid="viewport-mobile-btn"]').first();
  if (await mobileBtn.isVisible()) {
    await mobileBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '08_device_emulation_iphone15.png') });
    const deskBtn = page.locator('[data-testid="viewport-desktop-btn"]').first();
    if (await deskBtn.isVisible()) await deskBtn.click();
    await page.waitForTimeout(400);
  }

  // 9. Playwright Spec Code Generator
  console.log('9. Capturing 09_playwright_spec_code_generator.png...');
  const specBtn = page.locator('[data-testid="open-playwright-code-btn"]').first();
  if (await specBtn.isVisible()) {
    await specBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '09_playwright_spec_code_generator.png') });
    const closeCode = page.locator('[data-testid="playwright-code-close"], button:has-text("Close"), button:has-text("Kapat")').first();
    if (await closeCode.isVisible()) await closeCode.click();
    await page.waitForTimeout(400);
  }

  // 10. AI Self-Healing Heuristics
  console.log('10. Capturing 10_ai_self_healing_heuristics.png...');
  const healBtn = page.locator('[data-testid="open-self-healing-btn"]').first();
  if (await healBtn.isVisible()) {
    await healBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '10_ai_self_healing_heuristics.png') });
    const closeHeal = page.locator('[data-testid="self-healing-close"], button:has-text("Close"), button:has-text("Kapat")').first();
    if (await closeHeal.isVisible()) await closeHeal.click();
    await page.waitForTimeout(400);
  }

  // 11. Jira MCP Defect Tracker
  console.log('11. Capturing 11_jira_mcp_defect_tracker.png...');
  const intTab = page.locator('[data-testid="sidebar-tab-integrations"]').first();
  if (await intTab.isVisible()) {
    await intTab.click();
    await page.waitForTimeout(600);
    const cfgBtn = page.locator('button:has-text("Configure Integrations"), button:has-text("Entegrasyon Yapılandır"), [data-testid="integration-card-jira"]').first();
    if (await cfgBtn.isVisible()) {
      await cfgBtn.click();
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(DOCS_DIR, '11_jira_mcp_defect_tracker.png') });
      const closeJira = page.locator('[data-testid="close-integrations-modal"], button:has-text("Close"), button:has-text("Kapat")').first();
      if (await closeJira.isVisible()) await closeJira.click();
      await page.waitForTimeout(400);
    }
  }

  // 12. Customer Auth Vault
  console.log('12. Capturing 12_customer_auth_vault.png...');
  const scenariosTab = page.locator('[data-testid="sidebar-tab-scenarios"]').first();
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
  const schedTab = page.locator('[data-testid="sidebar-tab-scheduler"]').first();
  if (await schedTab.isVisible()) {
    await schedTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '13_multi_scenario_scheduler.png') });
  }

  // 14. Compliance & Security Audit
  console.log('14. Capturing 14_compliance_security_audit.png...');
  const compTab = page.locator('[data-testid="sidebar-tab-compliance"]').first();
  if (await compTab.isVisible()) {
    await compTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '14_compliance_security_audit.png') });
  }

  // Switch back to Dashboard
  const dashTab = page.locator('[data-testid="sidebar-tab-dashboard"]').first();
  if (await dashTab.isVisible()) {
    await dashTab.click();
    await page.waitForTimeout(500);
  }

  // 15. Light Mode Dashboard
  console.log('15. Capturing 15_light_mode_dashboard.png...');
  const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
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
  const guideBtn = page.locator('button:has-text("Training & Guide"), button:has-text("Training Guide"), button:has-text("Eğitim & Rehber")').first();
  if (await guideBtn.isVisible()) {
    await guideBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(DOCS_DIR, '16_training_guide.png') });
    
    // Reliably close modal
    const closeGuide = page.locator('[data-testid="training-guide-close"]').first();
    if (await closeGuide.isVisible()) {
      await closeGuide.click();
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
  }

  // 17. OmniMind AI Copilot
  console.log('17. Capturing 17_omnimind_ai_copilot.png...');
  // Open with Ctrl+J keyboard shortcut or click button
  await page.keyboard.press('Control+j');
  await page.waitForTimeout(600);
  
  const omniModal = page.locator('h2:has-text("OmniMind AI")').first();
  if (!await omniModal.isVisible()) {
    const omniBtn = page.locator('[data-testid="open-omnimind-ai-btn"]').first();
    if (await omniBtn.isVisible()) await omniBtn.click();
    await page.waitForTimeout(600);
  }
  
  await page.screenshot({ path: path.join(DOCS_DIR, '17_omnimind_ai_copilot.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  console.log('✅ ALL 17 SHOWCASE SCREENSHOTS SUCCESSFULLY RE-CAPTURED IN ENGLISH!');
  await browser.close();
}

recaptureAll().catch(err => {
  console.error('Error recapturing screenshots:', err);
  process.exit(1);
});
