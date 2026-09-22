import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const artifactDir = 'C:\\Users\\BERK.ARCAK\\.gemini\\antigravity\\brain\\84aa1859-793a-450d-9ba7-d9c7a6265edd';

async function testAllFeatures() {
  console.log('[QA Verify All] Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('[QA Verify All] Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });

  // 1. Check New Scenario Modal in Turkish
  console.log('[QA Verify All] 1. Testing New Scenario Modal in Turkish...');
  // Open dropdown from header
  const dropdownBtn = page.locator('button[data-testid="scenario-dropdown-btn"]').first();
  await dropdownBtn.click();
  await page.waitForTimeout(300);

  const addWorkflowBtn = page.locator('button:has-text("Yeni Senaryo Ekle"), button:has-text("Add Custom Workflow")').first();
  await addWorkflowBtn.click();
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(artifactDir, 'verify_01_new_scenario_modal_tr.png') });
  console.log('[QA Verify All] Saved verify_01_new_scenario_modal_tr.png');

  // Close modal
  const cancelBtn = page.locator('button:has-text("İptal"), button:has-text("Cancel")').first();
  await cancelBtn.click();
  await page.waitForTimeout(300);

  // 2. Capture Vibrant Animated Edges on Canvas
  console.log('[QA Verify All] 2. Capturing Vibrant Animated Edges...');
  await page.screenshot({ path: path.join(artifactDir, 'verify_02_vibrant_animated_edges.png') });
  console.log('[QA Verify All] Saved verify_02_vibrant_animated_edges.png');

  // 3. Open Training Guide Modal
  console.log('[QA Verify All] 3. Testing Training Guide Modal...');
  const trainingBtn = page.locator('button:has-text("Eğitim & Rehber")').first();
  await trainingBtn.click();
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(artifactDir, 'verify_03_training_guide.png') });
  console.log('[QA Verify All] Saved verify_03_training_guide.png');

  // Close training modal
  const closeTrainingBtn = page.locator('button[data-testid="close-training-guide"]').first();
  await closeTrainingBtn.click();
  await page.waitForTimeout(300);

  // 4. Test Scheduler View & New Schedule Modal
  console.log('[QA Verify All] 4. Testing Scheduler & New Task Modal...');
  const schedulerMenu = page.locator('button:has-text("Zamanlayıcı"), button:has-text("Scheduler")').first();
  await schedulerMenu.click();
  await page.waitForTimeout(400);

  const newScheduleBtn = page.locator('button[data-testid="schedule-new-job-btn"]').first();
  await newScheduleBtn.click();
  await page.waitForTimeout(400);

  await page.screenshot({ path: path.join(artifactDir, 'verify_04_new_schedule_modal.png') });
  console.log('[QA Verify All] Saved verify_04_new_schedule_modal.png');

  // Fill and submit schedule
  const jobTitleInput = page.locator('form input[type="text"]').first();
  await jobTitleInput.fill('Otomatik Gece Stok & Sepet Regresyonu');
  const submitScheduleBtn = page.locator('form button[type="submit"]').first();
  await submitScheduleBtn.click();
  await page.waitForTimeout(500);

  // Click Trigger Now on first row
  const triggerBtn = page.locator('button:has-text("Şimdi Tetikle")').first();
  await triggerBtn.click();
  await page.waitForTimeout(300);

  await page.screenshot({ path: path.join(artifactDir, 'verify_04_scheduler_table_triggered.png') });
  console.log('[QA Verify All] Saved verify_04_scheduler_table_triggered.png');

  // 5. Test Scenarios View & New Project Folder Modal with Smart URL Scanner
  console.log('[QA Verify All] 5. Testing Scenarios View & Smart URL Scanner...');
  const scenariosMenu = page.locator('button:has-text("Test Senaryoları"), button:has-text("Scenarios")').first();
  await scenariosMenu.click();
  await page.waitForTimeout(400);

  const newFolderBtn = page.locator('button:has-text("Yeni Site Klasörü")').first();
  await newFolderBtn.click();
  await page.waitForTimeout(400);

  const urlInput = page.locator('input[placeholder*="monsternotebook"]').first();
  await urlInput.fill('https://www.hepsiburada.com');
  // Wait for debounced smart URL scanner to finish
  await page.waitForTimeout(1000);

  await page.screenshot({ path: path.join(artifactDir, 'verify_05_smart_url_scanner.png') });
  console.log('[QA Verify All] Saved verify_05_smart_url_scanner.png');

  await browser.close();
  console.log('[QA Verify All] All verification checks finished successfully!');
}

testAllFeatures().catch(err => {
  console.error('[QA Verify All Error]', err);
  process.exit(1);
});
