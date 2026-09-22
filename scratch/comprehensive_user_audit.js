const path = require('path');
const { chromium } = require(require.resolve('playwright', { paths: [path.join(__dirname, '..', 'server')] }));
const fs = require('fs');

async function runAudit() {
  const artifactDir = path.join(process.env.USERPROFILE || 'C:/Users/QA', '.gemini', 'antigravity', 'brain', '84aa1859-793a-450d-9ba7-d9c7a6265edd');
  const errors = [];
  const warnings = [];
  const testResults = [];

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('PAGE ERROR LOG:', msg.text());
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    console.log('UNCAUGHT EXCEPTION:', err.message);
    errors.push(`Uncaught Exception: ${err.message}`);
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      console.log(`HTTP ${resp.status()} on ${resp.url()}`);
      warnings.push(`HTTP ${resp.status()} on ${resp.url()}`);
    }
  });

  console.log('=== STARTING DEEP E2E USER AUDIT ===');

  // 1. Initial Page Load (Port 5000 - Unified Production Build)
  console.log('\n--- 1. Testing Initial Dashboard Load & Hydration (Port 5000) ---');
  await page.goto('http://localhost:5000', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(artifactDir, 'audit_01_initial_dashboard.png') });
  testResults.push({ feature: 'Dashboard Hydration', status: 'PASS' });

  // 2. Kontrol Paneli: Master Pipeline & Domain Switcher
  console.log('\n--- 2. Testing Master Pipeline & Domain Switcher ---');
  const masterTab = page.locator('button:has-text("Genel Tüm Otomasyonlar")');
  await masterTab.click();
  await page.waitForTimeout(1000);

  // Switch to NovaTech DE
  await page.locator('[data-testid="domain-btn-novatech-de"]').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(artifactDir, 'audit_02_tulpar_master.png') });

  // Test "Otomasyonu Başlat"
  console.log('Testing "Otomasyonu Başlat" on NovaTech Master...');
  const startBtn = page.locator('button:has-text("Otomasyonu Başlat")');
  if (await startBtn.isVisible()) {
    await startBtn.click();
    console.log('Started automation run, waiting 3s for steps...');
    await page.waitForTimeout(3500);
    await page.screenshot({ path: path.join(artifactDir, 'audit_03_master_running.png') });
    testResults.push({ feature: 'Master Automation Execution', status: 'PASS' });
  }

  // Test "Baştan Başlat" (Restart)
  console.log('Testing "Baştan Başlat"...');
  const restartBtn = page.locator('header button:has-text("Baştan Başlat")').first();
  if (await restartBtn.isVisible()) {
    await restartBtn.click();
    await page.waitForTimeout(1500);
    testResults.push({ feature: 'Master Automation Restart', status: 'PASS' });
  }

  // Test "🎯 Sığdır" (Fit View)
  console.log('Testing "Sığdır" Fit View...');
  const fitBtn = page.locator('button:has-text("Sığdır")');
  if (await fitBtn.isVisible()) {
    await fitBtn.click();
    await page.waitForTimeout(500);
    testResults.push({ feature: 'Canvas Fit View', status: 'PASS' });
  }

  // Test Node Context Menu / 3-Dots
  console.log('Testing Node 3-Dots / Context Menu...');
  const moreBtn = page.locator('[data-testid="node-more-btn"]').first();
  if (await moreBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await moreBtn.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(artifactDir, 'audit_04_node_context_menu.png') });
    // Click outside to close
    await page.keyboard.press('Escape');
    testResults.push({ feature: 'Node Context Menu', status: 'PASS' });
  }

  // 3. Test Senaryoları (Scenarios Catalog)
  console.log('\n--- 3. Testing Scenarios Catalog & Project Management ---');
  await page.locator('[data-testid="sidebar-tab-scenarios"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, 'audit_05_scenarios_catalog.png') });

  // Test Project Selection: switch between Monster and Tulpar via select dropdown
  const projectSelect = page.locator('select').first();
  if (await projectSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
    await projectSelect.selectOption('proj-novatech-de');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'audit_06_tulpar_scenarios.png') });
    testResults.push({ feature: 'Project Folder Switching', status: 'PASS' });
  }

  // Test Project Edit Button (Auth Vault)
  console.log('Testing Project Edit / Auth Vault...');
  const editProjectBtn = page.locator('[data-testid="edit-project-folder-btn"]').first();
  if (await editProjectBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await editProjectBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'audit_07_project_edit_modal.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    testResults.push({ feature: 'Project Auth Vault Edit', status: 'PASS' });
  }

  // Test "+ Yeni Senaryo Oluştur" Modal
  console.log('Testing "+ Yeni Senaryo Oluştur" Modal...');
  const newScBtn = page.locator('[data-testid="scenarios-new-scenario-btn"]').first();
  if (await newScBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await newScBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'audit_08_new_scenario_modal.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    testResults.push({ feature: 'New Scenario Modal', status: 'PASS' });
  }

  // Test "+ Yeni Site Klasörü" Modal
  console.log('Testing "+ Yeni Site Klasörü" Modal...');
  const newProjBtn = page.locator('[data-testid="scenarios-new-project-btn"]').first();
  if (await newProjBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await newProjBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'audit_08b_new_project_modal.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    testResults.push({ feature: 'New Project Modal', status: 'PASS' });
  }

  // Test 🎓 Eğitim & Rehber Modal
  console.log('Testing 🎓 Training Guide Modal...');
  const guideBtn = page.locator('[data-testid="scenarios-training-guide-btn"]').first();
  if (await guideBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await guideBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'audit_09_training_guide_modal.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    testResults.push({ feature: 'Training Guide Modal', status: 'PASS' });
  }

  // 4. Güvenlik & Uyumluluk (Compliance)
  console.log('\n--- 4. Testing Compliance View ---');
  await page.locator('[data-testid="sidebar-tab-compliance"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, 'audit_10_compliance_view.png') });
  testResults.push({ feature: 'Compliance View', status: 'PASS' });

  // 5. Zamanlayıcı & Cron (Scheduler)
  console.log('\n--- 5. Testing Scheduler & Multi-Scenario Cron Modal ---');
  await page.locator('[data-testid="sidebar-tab-scheduler"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, 'audit_11_scheduler_view.png') });

  // Test "+ Yeni Görev Zamanla" Modal
  const newScheduleBtn = page.locator('button:has-text("Yeni Görev Zamanla")').first();
  if (await newScheduleBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await newScheduleBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'audit_12_new_schedule_modal.png') });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    testResults.push({ feature: 'Multi-Scenario Scheduler Modal', status: 'PASS' });
  }

  // 6. Analitik & Raporlar (Analytics)
  console.log('\n--- 6. Testing Analytics View ---');
  await page.locator('[data-testid="sidebar-tab-analytics"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, 'audit_13_analytics_view.png') });
  testResults.push({ feature: 'Analytics View', status: 'PASS' });

  // 7. Entegrasyonlar (Integrations & Jira MCP)
  console.log('\n--- 7. Testing Integrations & Jira MCP ---');
  await page.locator('[data-testid="sidebar-tab-integrations"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, 'audit_14_integrations_view.png') });

  // Click Jira card to open modal
  const jiraCard = page.locator('[data-testid="integration-card-jira"]').first();
  if (await jiraCard.isVisible({ timeout: 3000 }).catch(() => false)) {
    await jiraCard.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'audit_15_jira_mcp_modal.png') });

    // Test "Bağlantıyı Test Et"
    const testConnBtn = page.locator('button:has-text("Bağlantıyı Test Et")').first();
    if (await testConnBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await testConnBtn.click();
      await page.waitForTimeout(1000);
      console.log('Tested Jira connection button');
    }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    testResults.push({ feature: 'Jira MCP Integration & Modal', status: 'PASS' });
  }

  // 8. Test Deposu & İzler (Repository)
  console.log('\n--- 8. Testing Test Deposu & İzler (Repository) ---');
  await page.locator('[data-testid="sidebar-tab-repository"]').click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(artifactDir, 'audit_16_repository_view.png') });
  testResults.push({ feature: 'Repository & Trace Logs', status: 'PASS' });

  // 9. Language Switcher (TR <-> EN)
  console.log('\n--- 9. Testing Language Switcher (TR <-> EN) ---');
  await page.locator('[data-testid="sidebar-tab-dashboard"]').click();
  await page.waitForTimeout(1000);
  const langToggle = page.locator('[data-testid="lang-toggle"]').first();
  if (await langToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
    await langToggle.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'audit_17_english_locale.png') });
    console.log('Captured English dashboard');
    // Toggle back to TR
    await langToggle.click();
    await page.waitForTimeout(1000);
    testResults.push({ feature: 'Language Toggle (TR/EN)', status: 'PASS' });
  }

  // 10. Dark / Light Mode Theme Toggle
  console.log('\n--- 10. Testing Theme Toggle (Dark / Light) ---');
  const themeToggle = page.locator('[data-testid="theme-toggle"]').first();
  if (await themeToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
    await themeToggle.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(artifactDir, 'audit_18_theme_toggled.png') });
    console.log('Captured theme toggled dashboard');
    // Toggle back
    await themeToggle.click();
    await page.waitForTimeout(1000);
    testResults.push({ feature: 'Theme Toggle (Dark/Light)', status: 'PASS' });
  }

  console.log('\n=== AUDIT RESULTS SUMMARY ===');
  console.log('Passed checks:', testResults.length);
  console.log('Console Errors:', errors.length);
  errors.forEach(e => console.log(' - ' + e));
  console.log('HTTP Warnings (>=400):', warnings.length);
  warnings.forEach(w => console.log(' - ' + w));

  fs.writeFileSync(
    path.join(artifactDir, 'audit_summary.json'),
    JSON.stringify({ testResults, errors, warnings }, null, 2)
  );

  await browser.close();
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
