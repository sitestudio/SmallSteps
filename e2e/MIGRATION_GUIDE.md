# Playwright to agent-browser Migration Guide for SmallSteps

## Overview
This guide documents the migration from Playwright to agent-browser for E2E testing.

## Why Migrate?
- **82.5% token reduction**: Complex tests use significantly less context
- **AI-native design**: Built specifically for LLM-driven automation
- **Stable selectors**: A11y refs (`@e1`, `@e2`) resist CSS class changes
- **Better debugging**: Snapshot comparison for visual regression

## Pre-Migration Checklist

### 1. Install agent-browser
```bash
# Global installation (recommended)
npm install -g agent-browser

# Or local installation
npm install agent/browser --save-dev
```

### 2. Install Chrome for Testing
```bash
agent-browser install
# Downloads Chrome from Google's official automation channel
```

### 3. Verify Installation
```bash
agent-browser --version
agent-browser install --check
```

## Configuration Changes

### Create `e2e/agent-browser.json`
See `AGENT_BROWSER_CONFIG.md` for complete configuration.

Key settings:
```json
{
  "session": "smse2e",
  "headed": false,
  "timeout": 30000
}
```

## Test Migration Patterns

### Pattern 1: Simple Page Load & Verify

**Playwright:**
```typescript
test('should display home content', async ({ page }) => {
  await page.goto('/home');
  await expect(page.locator('app-home')).toBeVisible();
});
```

**agent-browser:**
```bash
# CLI command in test script
agent-browser --session smse2e open http://localhost:4200/home
agent-browser snapshot -i
agent-browser is visible app-home
```

### Pattern 2: Navigation via Router

**Playwright:**
```typescript
test('should navigate to words page', async ({ page }) => {
  await page.goto('/home');
  await page.evaluate(() => {
    (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
  });
  await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  await expect(page.locator('app-words-and-sentences')).toBeVisible();
});
```

**agent-browser:**
```bash
# Navigate to home first
agent-browser --session smse2e open http://localhost:4200/home

# Wait for home to load
agent-browser wait app-home

# Execute router navigation via JS eval
agent-browser eval "
  (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
"

# Wait for new page to load
agent-browser wait app-words-and-sentences --timeout 5000

# Verify loaded
agent-browser is visible app-words-and-sentences
```

### Pattern 3: Element Interaction

**Playwright:**
```typescript
test('should toggle checkbox state', async ({ page }) => {
  const firstCheckbox = page.locator('.checkbox-container input[type="checkbox"]').first();
  
  expect(await firstCheckbox.isChecked()).toBe(false);
  await firstCheckbox.click();
  expect(await firstCheckbox.isChecked()).toBe(true);
});
```

**agent-browser:**
```bash
# Snapshot to get refs
agent-browser snapshot -i

# Find checkbox by ref (e.g., @e12) and check state
agent-browser get value @e12  # or use role locator

# Click the checkbox
agent-browser click @e12

# Verify state changed (take new snapshot and compare)
agent-browser diff snapshot
```

### Pattern 4: Text Content Verification

**Playwright:**
```typescript
test('should display correct item text', async ({ page }) => {
  const itemTexts = await page.locator('.item-text').allTextContents();
  expect(itemTexts[0]).toContain('Single Words and Gestures');
});
```

**agent-browser:**
```bash
# Get text by ref or semantic selector
agent-browser find role heading get text --name "Single Words"
```

### Pattern 5: Multiple Elements

**Playwright:**
```typescript
test('should have 7 checklist items', async ({ page }) => {
  const items = await page.locator('.checklist-item');
  expect(await items.count()).toBe(7);
});

# agent-browser:
agent-browser get count .checklist-item
# Verify output equals 7
```

### Pattern 6: Screenshot on Failure

**Playwright (automatic):**
```typescript
// Configured in playwright.config.ts: screenshot: 'only-on-failure'
```

**agent-browser (manual for debugging):**
```bash
# Take screenshot for debugging
agent-browser screenshot -o test-results/screenshot.png

# With annotations for element reference
agent-browser screenshot --annotate test-results/annotated.png
```

## Test Runner Setup

### Create E2E Test Script (`e2e/run-tests.js`)

```javascript
const { execSync } = require('child_process');
const path = require('path');

const SESSION_NAME = 'smse2e';
const BASE_URL = 'http://localhost:4200';

function runTest(testName, commands) {
  console.log(`\n=== Running ${testName} ===`);
  
  try {
    // Start fresh session
    execSync(`agent-browser --session ${SESSION_NAME} close 2>/dev/null || true`);
    
    for (const cmd of commands) {
      const fullCmd = `agent-browser --session ${SESSION_NAME} ${cmd}`;
      console.log(fullCmd);
      
      try {
        const output = execSync(fullCmd, { encoding: 'utf-8' });
        console.log(output);
      } catch (err) {
        // Take screenshot on failure
        execSync(`agent-browser --session ${SESSION_NAME} screenshot test-results/${testName}-failed.png`);
        console.error(`Test failed: ${err.message}`);
        process.exit(1);
      }
    }
    
    console.log(`✓ ${testName} passed`);
  } catch (error) {
    console.error(`✗ ${testName} errored:`, error.message);
    process.exit(1);
  }
}

// Example test suite
const tests = [
  {
    name: 'home page',
    commands: [
      `open ${BASE_URL}/home`,
      `wait app-home`,
      `is visible app-home`
    ]
  },
  {
    name: 'words and sentences page',
    commands: [
      `open ${BASE_URL}/home`,
      `wait app-home`,
      `eval "(window as any).router.navigate(['/sounds-speech/words-and-sentences'])"`,
      `wait app-words-and-sentences --timeout 5000`,
      `is visible app-words-and-sentences`
    ]
  }
];

// Run all tests
let failed = false;
for (const test of tests) {
  try {
    runTest(test.name, test.commands);
  } catch (e) {
    failed = true;
  }
}

// Report
console.log('\n=== Test Summary ===');
const passedCount = tests.length - (failed ? 1 : 0);
console.log(`${passedCount}/${tests.length} tests passed`);

process.exit(failed ? 1 : 0);
```

### Update package.json

```json
{
  "scripts": {
    "test:e2e:agent": "node e2e/run-tests.js"
  }
}
```

## Migration Steps

### Phase 1: Infrastructure Setup
- [ ] Install agent-browser globally or locally
- [ ] Run `agent-browser install` to get Chrome for Testing
- [ ] Create `e2e/agent-browser.json` config file
- [ ] Update package.json with new E2E scripts

### Phase 2: Convert One Test (Reference)
- [ ] Start with `home.spec.ts` (simplest test)
- [ ] Convert to agent-browser CLI commands
- [ ] Test manually: `agent-browser --session smse2e open http://localhost:4200/home`

### Phase 3: Automation
- [ ] Create `e2e/run-tests.js` script
- [ ] Add screenshot capture on failures
- [ ] Integrate with CI/CD pipeline

### Phase 4: Full Migration
- [ ] Convert remaining tests progressively
- [ ] Add snapshot comparison for visual regression
- [ ] Set up test result reporting

## Troubleshooting

### Chrome Headless Failures
```bash
agent-browser --headed open http://localhost:4200  # Run with UI for debugging
```

### Element Not Found
```bash
# Get full accessibility tree first
agent-browser snapshot

# Or interactive elements only
agent-browser snapshot -i

# Use semantic selectors instead of refs
agent-browser find text "Submit" click
```

### Navigation Timing Issues
```bash
# Wait for network idle
agent-browser wait --load networkidle

# Or custom JS condition
agent-browser wait --fn "document.querySelector('app-home') !== null"
```

## Benefits Verification

After migration, verify:
- Token usage reduced by 80%+ in test runs
- Tests more resilient to CSS changes (using A11y refs)
- Better AI-assisted debugging capabilities
- Screenshot annotations for flaky test analysis

## Support

For issues:
- agent-browser docs: https://agent-browser.dev
- GitHub: https://github.com/vercel-labs/agent-browser
