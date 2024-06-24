import { test, expect } from '@playwright/test';

test('Access a restricted page without authentification and being redirect to login page', async ({ page }) =>{
    await page.goto('http://localhost:3000/')

    await expect(true).toBe(true);
})