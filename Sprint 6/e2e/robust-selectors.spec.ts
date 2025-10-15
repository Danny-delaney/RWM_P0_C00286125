import { test, expect } from '@playwright/test';

test.describe('ChecklistProgress — robust selectors via roles/testids', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // adjust if your route is different
  });

  test('Submit gate: ticking boxes does NOT change visible label until submit', async ({ page }) => {
    const status = page.getByRole('status');
    await expect(status).toHaveText('0/5 (0%)');

    // Tick two boxes using their accessible names (from labels)
    await page.getByRole('checkbox', { name: /Item 1/i }).check();
    await page.getByRole('checkbox', { name: /Item 2/i }).check();

    // Still gated until submit
    await expect(status).toHaveText('0/5 (0%)');

    await page.getByRole('button', { name: /submit version/i }).click();
    await expect(status).toHaveText('2/5 (40%)');
  });

  test('Repeat submit after changes → deterministic update', async ({ page }) => {
    const status = page.getByRole('status');

    // First submit with two checked
    await page.getByRole('checkbox', { name: /Item 1/i }).check();
    await page.getByRole('checkbox', { name: /Item 2/i }).check();
    await page.getByRole('button', { name: /submit version/i }).click();
    await expect(status).toHaveText('2/5 (40%)');

    // Change selection: uncheck Item 1, check Item 3 and Item 4
    await page.getByRole('checkbox', { name: /Item 1/i }).uncheck();
    await page.getByRole('checkbox', { name: /Item 3/i }).check();
    await page.getByRole('checkbox', { name: /Item 4/i }).check();

    // Submit again
    await page.getByRole('button', { name: /submit version/i }).click();
    await expect(status).toHaveText('3/5 (60%)');
  });

  test('All → 100%', async ({ page }) => {
    const status = page.getByRole('status');

    // Check all by role/name (no CSS nth-child!)
    for (const n of [1, 2, 3, 4, 5]) {
      await page.getByRole('checkbox', { name: new RegExp(`Item ${n}`, 'i') }).check();
    }

    await page.getByRole('button', { name: /submit version/i }).click();
    await expect(status).toHaveText('5/5 (100%)');
  });

  test('None → 0%', async ({ page }) => {
    const status = page.getByRole('status');

    // Ensure all are unchecked regardless of initial state
    for (const n of [1, 2, 3, 4, 5]) {
      const cb = page.getByRole('checkbox', { name: new RegExp(`Item ${n}`, 'i') });
      if (await cb.isChecked()) await cb.uncheck();
    }

    await page.getByRole('button', { name: /submit version/i }).click();
    await expect(status).toHaveText('0/5 (0%)');
  });
});
