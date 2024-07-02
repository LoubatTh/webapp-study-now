import { test, expect } from '@playwright/test';

test('Try to go on a locked page without being authentified', async ({ page }) =>{
    
    await page.goto('http://localhost:3000/profile');

    await page.waitForURL('http://localhost:3000/login');

    const url = page.url();

    expect(url).toBe('http://localhost:3000/login');
    
});

test('Try to register on the login page with a bad password (< 8 characters)', async ({ page }) =>{

    await page.goto('http://localhost:3000/login');

    await page.locator('button:text("Register")').click();

    const usernameInput = await page.locator('input[name="username"]');
    const emailInput = await page.locator('input[name="email"]');
    const passwordInput = await page.locator('input[name="password"]');
    const passwordConfirmInput = await page.locator('input[name="confirmPassword"]');

    await usernameInput.fill('username');
    await emailInput.fill('username@test.com');
    await passwordInput.fill('pass');
    await passwordConfirmInput.fill('pass');

    await page.locator('button:text("Créer un compte")').click();

    const errorMessage = await page.locator(
      'p:text("Le mot de passe doit contenir au moins 8 caractères")'
    );

    expect(errorMessage).not.toBeNull();

});

test('Try to register on the login page with a bad password (does not match)', async ({ page }) =>{
        
        await page.goto('http://localhost:3000/login');
    
        await page.locator('button:text("Register")').click();

        const usernameInput = await page.locator('input[name="username"]');
        const emailInput = await page.locator('input[name="email"]');
        const passwordInput = await page.locator('input[name="password"]');
        const passwordConfirmInput = await page.locator('input[name="confirmPassword"]');
        
        await usernameInput.fill('username');
        await emailInput.fill('username@test.com');
        await passwordInput.fill('password');
        await passwordConfirmInput.fill('paSsWorD');

        await page.locator('button:text("Register")').click();

        const errorMessage = await page.locator(
            'p:text("Les mots de passe ne correspondent pas")'
            );

        expect(errorMessage).not.toBeNull();
    });

test('Try to register on the login page', async ({ page }) =>{
        
        await page.goto('http://localhost:3000/login');
    
        await page.locator('button:text("Register")').click();
    
        const usernameInput = await page.locator('input[name="username"]');
        const emailInput = await page.locator('input[name="email"]');
        const passwordInput = await page.locator('input[name="password"]');
        const passwordConfirmInput = await page.locator('input[name="confirmPassword"]');
        
        await usernameInput.fill('username');
        await emailInput.fill('username@test.com');
        await passwordInput.fill('password');
        await passwordConfirmInput.fill('password');
        
        await page.locator('button:text("Register")').click();

        const successMessage = await page.locator(
            'div:text("Enregistrement effectué")'
            );

        expect(successMessage).not.toBeNull();

        });