import { test, expect } from '@playwright/test';

// This test navigates to /lab/checklist and asserts the title

test('Checklist page displays correct title', async ({ page }) => {
  await page.goto('/lab/checklist');
  const title = await page.getByTestId('title');
  await expect(title).toHaveText('Progress Checklist');
});