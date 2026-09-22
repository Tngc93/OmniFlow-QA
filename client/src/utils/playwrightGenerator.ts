import { Scenario } from '../types';

export function generatePlaywrightCode(
  scenario: Scenario | null,
  viewport: 'desktop' | 'mobile' | 'tablet' = 'desktop',
  creds = { email: 'qa.testuser@flowshop.mock', password: 'FlowShopQA!2026Secure' }
): string {
  const scenarioTitle = scenario?.title || 'E-Commerce Test Automation Flow';
  const targetUrl = scenario?.targetUrl || 'https://flowshop-tr.mock';
  const nodes = scenario?.nodes || [];

  let viewportWidth = 1920;
  let viewportHeight = 1080;
  let isMobile = false;

  if (viewport === 'mobile') {
    viewportWidth = 393;
    viewportHeight = 852;
    isMobile = true;
  } else if (viewport === 'tablet') {
    viewportWidth = 820;
    viewportHeight = 1180;
  }

  const isDe = targetUrl.includes('.de') || (scenario?.id && scenario.id.includes('-de'));

  // Build step-by-step statements
  const stepStatements = nodes.map((node, index) => {
    const nodeName = node.data.name || node.data.label || `Step ${index + 1}`;
    const nodeSubtext = node.data.subtext || node.data.expected || 'Validate step execution';
    const lower = nodeName.toLowerCase() + ' ' + nodeSubtext.toLowerCase();

    if (node.type === 'terminatorNode') {
      if (node.data.isStart) {
        return `    // Step ${index + 1}: ${nodeName}
    await test.step('${nodeName}', async () => {
      await page.goto('${targetUrl}', { waitUntil: 'networkidle' });
      await expect(page).toHaveTitle(/FlowShop/i);
    });\n`;
      } else {
        return `    // Step ${index + 1}: ${nodeName}
    await test.step('${nodeName}', async () => {
      // Final assertions and execution telemetry
      await page.screenshot({ path: 'test-results/final-${node.id}.png', fullPage: true });
      console.log('✅ Flow completed successfully: ${nodeName}');
    });\n`;
      }
    }

    if (lower.includes('search') || lower.includes('arama')) {
      const query = isDe ? 'Titan' : 'Horizon';
      return `    // Step ${index + 1}: ${nodeName}
    await test.step('${nodeName}', async () => {
      const searchInput = page.locator('input[type="search"], input[name="q"], input.search-input').first();
      await searchInput.fill('${query}');
      await searchInput.press('Enter');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('body')).toContainText(/${query}/i);
      await page.screenshot({ path: 'test-results/step-${index + 1}-search.png' });
    });\n`;
    }

    if (lower.includes('cookie') || lower.includes('çerez') || lower.includes('dsgvo') || lower.includes('kvkk')) {
      return `    // Step ${index + 1}: ${nodeName}
    await test.step('${nodeName}', async () => {
      const cookieAcceptBtn = page.locator('button:has-text("Kabul Et"), button:has-text("Alle akzeptieren"), #CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll').first();
      if (await cookieAcceptBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await cookieAcceptBtn.click();
      }
    });\n`;
    }

    if (lower.includes('pdp') || lower.includes('ürün') || lower.includes('laptop') || lower.includes('configur')) {
      return `    // Step ${index + 1}: ${nodeName}
    await test.step('${nodeName}', async () => {
      const productCard = page.locator('.product-item, .product-card, a[href*="horizon"], a[href*="titan"], a[href*="laptop"]').first();
      await productCard.click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toBeVisible();
      await page.screenshot({ path: 'test-results/step-${index + 1}-pdp.png' });
    });\n`;
    }

    if (lower.includes('cart') || lower.includes('sepet') || lower.includes('warenkorb')) {
      return `    // Step ${index + 1}: ${nodeName}
    await test.step('${nodeName}', async () => {
      const addToCartBtn = page.locator('button:has-text("Sepete Ekle"), button:has-text("In den Warenkorb"), [data-testid="add-cart-btn"]').first();
      await addToCartBtn.click();
      await expect(page.locator('.cart-count, .header-cart, text=Sepet')).toBeVisible();
      await page.screenshot({ path: 'test-results/step-${index + 1}-cart.png' });
    });\n`;
    }

    if (lower.includes('checkout') || lower.includes('ödeme') || lower.includes('kasse') || lower.includes('auth')) {
      return `    // Step ${index + 1}: ${nodeName}
    await test.step('${nodeName}', async () => {
      // Customer Auth Vault Injection
      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await emailInput.fill('${creds.email}');
        await page.locator('input[type="password"]').first().fill('${creds.password}');
        await page.locator('button[type="submit"], button:has-text("Giriş"), button:has-text("Anmelden")').first().click();
      }
      await page.screenshot({ path: 'test-results/step-${index + 1}-checkout.png' });
    });\n`;
    }

    // Default Step fallback
    return `    // Step ${index + 1}: ${nodeName}
    await test.step('${nodeName}', async () => {
      console.log('Executing: ${nodeName}');
      // Target expectation: ${nodeSubtext}
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'test-results/step-${index + 1}.png' });
    });\n`;
  }).join('\n');

  return `/**
 * =========================================================================
 * OmniFlow QA - Auto-Generated Playwright TypeScript E2E Test Suite
 * Generated on: ${new Date().toISOString()}
 * Target Domain: ${targetUrl}
 * Scenario: ${scenarioTitle}
 * Viewport Emulation: ${viewport.toUpperCase()} (${viewportWidth}x${viewportHeight})
 * =========================================================================
 */

import { test, expect } from '@playwright/test';

test.describe('OmniFlow E2E: ${scenarioTitle.replace(/'/g, "\\'")}', () => {
  test.use({
    viewport: { width: ${viewportWidth}, height: ${viewportHeight} },
    ${isMobile ? `isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',` : `userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',`}
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  });

  test('Execute Automated Multi-Step Pipeline', async ({ page }) => {
${stepStatements}
  });
});
`;
}
