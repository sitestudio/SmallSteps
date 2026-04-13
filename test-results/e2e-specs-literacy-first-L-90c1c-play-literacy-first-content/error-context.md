# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/specs/literacy-first.spec.ts >> Literacy First Page >> should display literacy first content
- Location: e2e/specs/literacy-first.spec.ts:8:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('app-literacy-first')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('app-literacy-first')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - checkbox "Training Mode" [ref=e6] [cursor=pointer]
    - text: Training Mode
  - banner [ref=e7]:
    - heading "TinySteps" [level=1] [ref=e8]
    - paragraph [ref=e9]: Choose a learning adventure!
  - generic [ref=e10]:
    - generic [ref=e12]:
      - link "🎨 Let's Play" [ref=e14] [cursor=pointer]:
        - /url: /math-numbers
        - generic [ref=e15]: 🎨
        - generic [ref=e16]: Let's Play
      - generic [ref=e18] [cursor=pointer]:
        - generic [ref=e19]: 📚
        - generic [ref=e20]: Language & Literacy
      - link "🔢 Maths & Numbers" [ref=e22] [cursor=pointer]:
        - /url: /math-numbers
        - generic [ref=e23]: 🔢
        - generic [ref=e24]: Maths & Numbers
      - link "❤️ Social/Emotional" [ref=e26] [cursor=pointer]:
        - /url: /social-emotional
        - generic [ref=e27]: ❤️
        - generic [ref=e28]: Social/Emotional
      - link "🏃 Physical" [ref=e30] [cursor=pointer]:
        - /url: /physical
        - generic [ref=e31]: 🏃
        - generic [ref=e32]: Physical
      - link "🧠 Executive Function" [ref=e34] [cursor=pointer]:
        - /url: /executive-function
        - generic [ref=e35]: 🧠
        - generic [ref=e36]: Executive Function
    - generic [ref=e37]:
      - heading "Choose Your Animal" [level=3] [ref=e38]
      - generic [ref=e39]: Animals to Try
      - generic [ref=e40]:
        - generic [ref=e41] [cursor=pointer]:
          - img "Lion" [ref=e42]
          - generic [ref=e43]: Lion
        - generic [ref=e44] [cursor=pointer]:
          - img "Tiger" [ref=e45]
          - generic [ref=e46]: Tiger
        - generic [ref=e47] [cursor=pointer]:
          - img "Elephant" [ref=e48]
          - generic [ref=e49]: Elephant
        - generic [ref=e50] [cursor=pointer]:
          - img "Bear" [ref=e51]
          - generic [ref=e52]: Bear
        - generic [ref=e53] [cursor=pointer]:
          - img "Zebra" [ref=e54]
          - generic [ref=e55]: Zebra
        - generic [ref=e56] [cursor=pointer]:
          - img "Giraffe" [ref=e57]
          - generic [ref=e58]: Giraffe
        - generic [ref=e59] [cursor=pointer]:
          - img "Monkey" [ref=e60]
          - generic [ref=e61]: Monkey
        - generic [ref=e62] [cursor=pointer]:
          - img "Kangaroo" [ref=e63]
          - generic [ref=e64]: Kangaroo
        - generic [ref=e65] [cursor=pointer]:
          - img "Panda" [ref=e66]
          - generic [ref=e67]: Panda
        - generic [ref=e68] [cursor=pointer]:
          - img "Koala" [ref=e69]
          - generic [ref=e70]: Koala
        - generic [ref=e71] [cursor=pointer]:
          - img "Hippo" [ref=e72]
          - generic [ref=e73]: Hippo
        - generic [ref=e74] [cursor=pointer]:
          - img "Rhino" [ref=e75]
          - generic [ref=e76]: Rhino
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Literacy First Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('http://localhost:4200/#/training/literacy-first');
  6  |   });
  7  | 
  8  |   test('should display literacy first content', async ({ page }) => {
> 9  |     await expect(page.locator('app-literacy-first')).toBeVisible();
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  10 |   });
  11 | });
  12 | 
```