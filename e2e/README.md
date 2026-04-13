# Playwright End-to-End Testing

This directory contains automated tests for the SmallSteps Angular application using Playwright.

## Setup

Playwright has been installed as a dev dependency. Browsers are downloaded automatically on first test run.

## Test Files

Tests are located in `specs/` directory with `.spec.ts` extension:
- `home.spec.ts` - Tests for the home page
- Add more test files as needed

## Running Tests

### Headed Mode (Show Browser)
```bash
npm run test:e2e:ui
```

### Headless Mode (CI/CD)
```bash
npm run test:e2e:headless
```

### Run All Tests
```bash
npm run test:e2e
```

## Writing New Tests

1. Create a new file in `specs/` (e.g., `training.spec.ts`)
2. Use Playwright's API to interact with the app
3. Run `npm run test:e2e` to verify

Example:
```typescript
import { test, expect } from '@playwright/test';

test('should navigate to training page', async ({ page }) => {
  await page.goto('/training/literacy-first');
  await expect(page.locator('app-literacy-first')).toBeVisible();
});
```

## Test Configuration

Edit `playwright.config.ts` to modify:
- Browser targets (chromium, firefox, webkit)
- Test timeout
- Screenshot policy
- baseURL for development server

## CI/CD Integration

For automated testing in pipelines:
1. Start dev server: `npm start`
2. Run tests: `PLAYWRIGHT_HEADLESS=1 npm run test:e2e`
3. Check results in `playwright-report/` directory

## Integration with Development Workflow

To run tests against live app:
1. Keep dev server running: `npm start`
2. Run e2e tests in another terminal
3. Test results will reflect app state
