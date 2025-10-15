import { test, expect } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
  await page.goto('/');
  // Prefer roles/names over CSS: robust to styling changes
  await expect(page.getByRole('heading', { name: 'Progress Checklist' })).toBeVisible();
});
