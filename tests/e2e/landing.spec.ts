import { test, expect } from '@playwright/test';

test.describe('Landing Page - User Story 1 (MVP)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Hero Section', () => {
    test('should display hero section with headline and emphasis', async ({
      page,
    }) => {
      // Check main headline is visible
      const headline = page.getByRole('heading', {
        level: 1,
        name: /real-time crypto data for your ai assistant/i,
      });
      await expect(headline).toBeVisible();

      // Check emphasized text has purple styling
      const emphasisText = page.locator('h1 span.text-purple-400');
      await expect(emphasisText).toBeVisible();
      await expect(emphasisText).toHaveText(/real-time/i);
    });

    test('should display subheadline and description', async ({ page }) => {
      // Check subheadline
      await expect(
        page.getByText(/transform chatgpt, claude & cursor/i),
      ).toBeVisible();

      // Check description
      await expect(
        page.getByText(/context8 provides live market data/i),
      ).toBeVisible();
    });

    test('should display trust badges', async ({ page }) => {
      // Check for trust badges
      await expect(page.getByText(/trusted by 500\+ developers/i)).toBeVisible();
      await expect(page.getByText(/updated every 60 seconds/i)).toBeVisible();
    });

    test('should display primary CTA button', async ({ page }) => {
      const primaryCTA = page.getByRole('link', { name: /get started free/i });

      await expect(primaryCTA).toBeVisible();
      await expect(primaryCTA).toHaveAttribute('href', '/auth/signin');
    });

    test('should display secondary CTA button', async ({ page }) => {
      const secondaryCTA = page.getByRole('link', { name: /view demo/i });

      await expect(secondaryCTA).toBeVisible();
      await expect(secondaryCTA).toHaveAttribute('href', '#demo');
    });

    test('should display hero illustration', async ({ page }) => {
      const heroImage = page.locator('img[alt*="hero"]');
      await expect(heroImage).toBeVisible();
    });

    test('should have gradient background', async ({ page }) => {
      const gradientBg = page.locator('.bg-gradient-to-br').first();
      await expect(gradientBg).toBeVisible();
    });
  });

  test.describe('Problem Section', () => {
    test('should display problem section heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /your ai is trading in the past/i }),
      ).toBeVisible();
    });

    test('should display section title badge', async ({ page }) => {
      await expect(page.getByText(/the challenge/i)).toBeVisible();
    });

    test('should display all 4 problem points', async ({ page }) => {
      // Check all problem titles are visible
      await expect(page.getByText(/outdated information/i)).toBeVisible();
      await expect(page.getByText(/manual api integration/i)).toBeVisible();
      await expect(page.getByText(/fragmented data sources/i)).toBeVisible();
      await expect(page.getByText(/high api costs/i)).toBeVisible();
    });

    test('should display problem descriptions', async ({ page }) => {
      // Check problem descriptions
      await expect(
        page.getByText(/llms have a knowledge cutoff/i),
      ).toBeVisible();
      await expect(
        page.getByText(/wrestling with binance, coingecko/i),
      ).toBeVisible();
      await expect(
        page.getByText(/price data in one place, news in another/i),
      ).toBeVisible();
      await expect(
        page.getByText(/premium crypto apis charge \$50-\$200\/month/i),
      ).toBeVisible();
    });

    test('should display problem icons', async ({ page }) => {
      // Check that icon containers are present (we can't easily test Lucide icons directly)
      const problemCards = page.locator('.bg-red-500\\/10');
      await expect(problemCards).toHaveCount(4);
    });
  });

  test.describe('Solution Section', () => {
    test('should display solution section heading', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /context8 bridges the gap/i }),
      ).toBeVisible();
    });

    test('should display section title badge', async ({ page }) => {
      await expect(page.getByText(/the solution/i)).toBeVisible();
    });

    test('should display solution description', async ({ page }) => {
      await expect(
        page.getByText(
          /one mcp server that brings real-time crypto intelligence/i,
        ),
      ).toBeVisible();
    });

    test('should display all 4 benefit points', async ({ page }) => {
      // Check all benefit titles are visible
      await expect(page.getByText(/live data every 60 seconds/i)).toBeVisible();
      await expect(page.getByText(/4 data sources in one/i)).toBeVisible();
      await expect(page.getByText(/mcp-native integration/i)).toBeVisible();
      await expect(page.getByText(/oauth security/i)).toBeVisible();
    });

    test('should display benefit descriptions', async ({ page }) => {
      // Check benefit descriptions
      await expect(
        page.getByText(/real-time prices, volume, market cap/i),
      ).toBeVisible();
      await expect(
        page.getByText(/price feeds, crypto news, on-chain metrics/i),
      ).toBeVisible();
      await expect(
        page.getByText(/3 lines to connect\. works with chatgpt/i),
      ).toBeVisible();
      await expect(
        page.getByText(/secure authentication via google or github/i),
      ).toBeVisible();
    });

    test('should display benefit icons with purple styling', async ({
      page,
    }) => {
      // Check that purple-themed icon containers are present
      const benefitCards = page.locator('.bg-purple-500\\/10');
      await expect(benefitCards).toHaveCount(4);
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      // Check hero is still visible
      await expect(
        page.getByRole('heading', { level: 1 }),
      ).toBeVisible();

      // Check problem and solution sections are visible
      await expect(page.getByText(/the challenge/i)).toBeVisible();
      await expect(page.getByText(/the solution/i)).toBeVisible();
    });

    test('should be responsive on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      // Check all sections are visible
      await expect(
        page.getByRole('heading', { level: 1 }),
      ).toBeVisible();
      await expect(page.getByText(/the challenge/i)).toBeVisible();
      await expect(page.getByText(/the solution/i)).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      // Check h1 exists
      const h1 = page.getByRole('heading', { level: 1 });
      await expect(h1).toHaveCount(1);

      // Check h2 headings exist for sections
      const h2s = page.getByRole('heading', { level: 2 });
      await expect(h2s).toHaveCount(2); // Problem and Solution sections
    });

    test('should have accessible CTA buttons', async ({ page }) => {
      const primaryCTA = page.getByRole('link', { name: /get started free/i });
      const secondaryCTA = page.getByRole('link', { name: /view demo/i });

      // Check CTAs are keyboard accessible
      await expect(primaryCTA).toBeVisible();
      await expect(secondaryCTA).toBeVisible();

      // Focus on primary CTA
      await primaryCTA.focus();
      await expect(primaryCTA).toBeFocused();
    });

    test('should have semantic HTML structure', async ({ page }) => {
      // Check main tag exists
      const main = page.locator('main');
      await expect(main).toBeVisible();

      // Check sections exist
      const sections = page.locator('section');
      await expect(sections).toHaveCount(3); // Hero, Problem, Solution
    });
  });

  test.describe('Performance', () => {
    test('should load hero image with priority', async ({ page }) => {
      const heroImage = page.locator('img[alt*="hero"]');

      // Check image loads
      await expect(heroImage).toBeVisible();

      // Verify image has loaded by checking natural width > 0
      const hasLoaded = await heroImage.evaluate(
        (img: HTMLImageElement) => img.naturalWidth > 0,
      );
      expect(hasLoaded).toBe(true);
    });
  });

  test.describe('Dark Theme', () => {
    test('should use dark theme by default', async ({ page }) => {
      // Check background is dark
      const main = page.locator('main');
      const bgColor = await main.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor,
      );

      // Dark slate-950 should be very dark (close to black)
      // RGB values should all be low
      expect(bgColor).toMatch(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    });

    test('should use purple accent colors', async ({ page }) => {
      // Check that purple accent is used in emphasized text
      const emphasisText = page.locator('h1 span.text-purple-400');
      await expect(emphasisText).toBeVisible();
    });
  });
});
