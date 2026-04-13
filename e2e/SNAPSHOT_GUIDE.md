# agent-browser Snapshot Reference Guide

This guide shows how to convert Playwright E2E tests to agent-browser format.

## Step-by-Step Conversion Process

### 1. Start Session andTake Snapshot

```bash
agent-browser --session smse2e open http://localhost:4200/home

# Take snapshot with refs (A11y tree)
agent-browser --session smse2e snapshot
# OR for interactive elements only:
agent-browser --session smse2e snapshot -i

# Output looks like:
# - heading "SmallSteps" [ref=e1] [level=1]
# - link "Home" [ref=e2]
# - link "Training" [ref=e3]
# - role button "Submit" [ref=e4]
```

### 2. Convert Playwright Locators to agent-browser Commands

| Playwright Pattern | agent-browser Equivalent |
|-------------------|------------------------|
| `page.locator('app-home')` | `is visible app-home` |
| `expect(page.locator('.checklist-item')).toBeVisible()` | `find role list get text` |
| `page.click('.checkbox')` | `click @e4` (use ref from snapshot) |
| `page.evaluate(() => router.navigate())` | `eval "(window as any).router.navigate(['/path'])"` |
| `page.waitForSelector(selector)` | `wait selector --timeout 5000` |

### 3. Element Reference Workflow

1. Take initial snapshot: `agent-browser snapshot -i`
2. Note the ref IDs (e1, e2, etc.)
3. Use refs in subsequent commands: `click @e4`
4. After navigation/actions, take new snapshot
5. Use `diff snapshot` to see changes

### 4. Example: Checkbox Test Conversion

**Original Playwright:**
```typescript
test('should toggle checkbox state', async ({ page }) => {
  const firstCheckbox = page.locator('.checkbox-container input[type="checkbox"]').first();
  
  expect(await firstCheckbox.isChecked()).toBe(false);
  await firstCheckbox.click();
  expect(await firstCheckbox.isChecked()).toBe(true);
});
```

**agent-browser version:**
```bash
# Step 1: Take snapshot to get checkbox ref
agent-browser --session smse2e open http://localhost:4200/home
agent-browser --session smse2e snapshot -i

# Output shows: input type="checkbox" [ref=e15]

# Step 2: Check initial state
agent-browser --session smse2e get value @e15

# Step 3: Click checkbox
agent-browser --session smse2e click @e15

# Step 4: Verify state changed (new snapshot)
agent-browser --session smse2e snapshot -i

# Step 5: Compare diffs
agent-browser --session smse2e diff snapshot
```

### 5. Snapshot Diff for Visual Regression

```bash
# baseline snapshot (before action)
agent-browser --session smse2e snapshot -i > before.txt

# perform action
agent-browser --session smse2e click @e15

# after snapshot (after action)
agent-browser --session smse2e snapshot -i > after.txt

# Compare
agent-browser --session smse2e diff snapshot --baseline before.txt

# Visual pixel diff
agent-browser --session smse2e screenshot baseline.png
# ...perform action...
agent-browser --session smse2e diff screenshot --baseline baseline.png -o diff.png
```

### 6. Common TestingPatterns

#### Test Page Load
```bash
agent-browser --session smse2e open http://localhost:4200/path
agent-browser --session smse2e wait selector --timeout 5000
agent-browser --session smse2e is visible selector
```

#### Test Navigation
```bash
agent-browser --session smse2e open http://localhost:4200/home
agent-browser --session smse2e click @e3  # Click Training link
agent-browser --session smse2e wait app-training --timeout 5000
agent-browser --session smse2e is visible app-training
```

#### Test Form Input
```bash
agent-browser --session smse2e open http://localhost:4200/form
agent-browser --session smse2e snapshot -i  # Find input refs
agent-browser --session smse2e fill @e5 "test@example.com"
agent-browser --session smse2e click @e6  # Submit button
```

### 7. Debugging Commands

```bash
# View page title
agent-browser --session smse2e get title

# View current URL
agent-browser --session smse2e get url

# Take screenshot for debugging
agent-browser --session smse2e screenshot --annotate debug.png

# View console logs
agent-browser --session smse2e console

# View all cookies
agent-browser --session smse2e cookies

# Check element count
agent-browser --session smse2e get count .selector
```

### 8. Running Test Commands

```bash
# Interactive mode (see browser UI)
agent-browser --headed --session smse2e open http://localhost:4200

# Batch mode (multiple commands in one invocation)
agent-browser --session smse2e batch \
  "open http://localhost:4200/home" \
  "wait app-home" \
  "is visible app-home"

# Using --bail to stop on first error
agent-browser --session smse2e batch --bail \
  "open http://localhost:4200/home" \
  "click @e15"
```

### Quick Ref Sheet

| What You Want To Do | agent-browser Command |
|-------------------|----------------------|
| Open page | `open http://localhost:4200/path` |
| Take snapshot | `snapshot -i` (interactive only) |
| Find by text | `find text "Submit" click` |
| Find by role | `find role button get text --name "Login"` |
| Click by ref | `click @e4` |
| Fill input | `fill @e5 "value"` |
| Wait for element | `wait selector --timeout 5000` |
| Verify visibility | `is visible selector` |
| Check count | `get count selector` |
| Take screenshot | `screenshot --annotate result.png` |
| Compare diff | `diff snapshot --baseline before.txt` |

