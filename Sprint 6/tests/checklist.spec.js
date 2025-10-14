import { test, expect } from '@playwright/test';

test('Checklist page displays correct title', async ({ page }) => {
  await page.goto('/lab/checklist');
  const title = await page.getByTestId('title');
  await expect(title).toHaveText('Progress Checklist');
});

test('ChecklistProgress submit-gated progress', async ({ page }) => {
  await page.goto('/lab/checklist');
  const progress = await page.getByTestId('progress');
  await expect(progress).toHaveText('0/5 (0%)');

  const checkboxes = await page.locator('[data-testid="checkbox"]');
  await checkboxes.nth(0).check();
  await checkboxes.nth(1).check();
  await expect(progress).toHaveText('0/5 (0%)');

  await page.getByTestId('submit').click();
  await expect(progress).toHaveText('2/5 (40%)');
});