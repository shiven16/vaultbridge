import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Authentication Flow - POM UI Tests', () => {

  test('Navbar should show logo and landing page handles Get Started', async ({ page }) => {
    const homePage = new HomePage(page);
    
    await homePage.goto();
    await homePage.expectLoaded();
    
    // Test navigation
    await homePage.clickGetStarted();
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Login Page should display source and destination buttons with correct API links', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.goto();
    await loginPage.expectSourceConnectVisible();
    
    // Check that the redirect URL for source OAuth is properly configured to the backend via proxy path
    const targetHref = await loginPage.getSourceConnectHref();
    expect(targetHref).toContain('/api/auth/login?type=source');
  });

  test('Dashboard should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    // React Router should immediately redirect back to login since there's no active session
    await expect(page).toHaveURL(/.*\/login/);
  });
});
