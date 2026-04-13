# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/specs/words-and-sentences.spec.ts >> Words and Sentences Page - Animal Display >> should display the name of auto-assigned animal
- Location: e2e/specs/words-and-sentences.spec.ts:97:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.textContent: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.animal-name-display')

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
  2   | 
  3   | test.describe('Words and Sentences Page', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('http://localhost:4200/');
  6   |     await page.evaluate(() => {
  7   |       (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
  8   |     });
  9   |     await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  10  |   });
  11  | 
  12  |   test('should display the words and sentences page content', async ({ page }) => {
  13  |     await expect(page.locator('app-words-and-sentences')).toBeVisible();
  14  |   });
  15  | 
  16  |   test('should display all checklist items', async ({ page }) => {
  17  |     const items = await page.locator('.checklist-item');
  18  |     expect(await items.count()).toBe(7);
  19  |   });
  20  | 
  21  |   test('should display checkbox for each item', async ({ page }) => {
  22  |     const checkboxes = await page.locator('.checkbox-container input[type="checkbox"]');
  23  |     expect(await checkboxes.count()).toBe(7);
  24  |   });
  25  | 
  26  |   test('should have navigation buttons', async ({ page }) => {
  27  |     const homeBtn = await page.locator('.nav-home');
  28  |     const backBtn = await page.locator('.nav-back');
  29  |     await expect(homeBtn).toBeVisible();
  30  |     await expect(backBtn).toBeVisible();
  31  |   });
  32  | 
  33  |   test('should have proper back link', async ({ page }) => {
  34  |     const backLink = await page.locator('a.back-link');
  35  |     await expect(backLink).toBeVisible();
  36  |     await expect(backLink).toContainText('Sounds and Speech');
  37  |   });
  38  | 
  39  |   test('should expand description on item click', async ({ page }) => {
  40  |     const firstItem = page.locator('.checklist-item').first();
  41  |     
  42  |     await firstItem.click({ offset: { x: 50, y: 50 } });
  43  |     
  44  |     const description = firstItem.locator('.description-content');
  45  |     await expect(description).toBeVisible();
  46  |   });
  47  | 
  48  |   test('should collapse description on second click', async ({ page }) => {
  49  |     const firstItem = page.locator('.checklist-item').first();
  50  |     
  51  |     await firstItem.click({ offset: { x: 50, y: 50 } });
  52  |     await expect(firstItem.locator('.description-content')).toBeVisible();
  53  |     
  54  |     await firstItem.click({ offset: { x: 50, y: 50 } });
  55  |     await expect(firstItem.locator('.description-content')).not.toBeVisible();
  56  |   });
  57  | 
  58  |   test('should toggle checkbox state', async ({ page }) => {
  59  |     const firstCheckbox = await page.locator('.checkbox-container input[type="checkbox"]').first();
  60  |     
  61  |     expect(await firstCheckbox.isChecked()).toBe(false);
  62  |     
  63  |     await firstCheckbox.click();
  64  |     expect(await firstCheckbox.isChecked()).toBe(true);
  65  |   });
  66  | 
  67  |   test('should display correct item text', async ({ page }) => {
  68  |     const itemTexts = await page.locator('.item-text').allTextContents();
  69  |     
  70  |     expect(itemTexts[0]).toContain('Single Words and Gestures');
  71  |     expect(itemTexts[itemTexts.length - 1]).toContain('Many longer sentences, rich language, stories');
  72  |   });
  73  | });
  74  | 
  75  | test.describe('Words and Sentences Page - Animal Display', () => {
  76  |   test.beforeEach(async ({ page }) => {
  77  |     await page.goto('http://localhost:4200/#/sounds-speech/words-and-sentences');
  78  |   });
  79  | 
  80  |   test('should display selected animal icon at top', async ({ page }) => {
  81  |     await expect(page.locator('.selected-animal-icon')).toBeVisible();
  82  |   });
  83  | 
  84  |   test('should display animal name message', async ({ page }) => {
  85  |     await expect(page.locator('.animal-name-display')).toBeVisible();
  86  |   });
  87  | 
  88  |   test('should auto-assign animal when none selected', async ({ page }) => {
  89  |     await page.evaluate(() => localStorage.removeItem('tinyStepsSelectedAnimal'));
  90  |     
  91  |     await page.goto('http://localhost:4200/#/sounds-speech/words-and-sentences');
  92  |     
  93  |     const animalIcon = await page.locator('.selected-animal-icon');
  94  |     expect(await animalIcon.isVisible()).toBe(true);
  95  |   });
  96  | 
  97  |   test('should display the name of auto-assigned animal', async ({ page }) => {
  98  |     await page.evaluate(() => localStorage.removeItem('tinyStepsSelectedAnimal'));
  99  |     
  100 |     await page.goto('http://localhost:4200/#/sounds-speech/words-and-sentences');
  101 |     
> 102 |     const animalName = await page.locator('.animal-name-display').textContent();
      |                                                                   ^ Error: locator.textContent: Test timeout of 30000ms exceeded.
  103 |     expect(animalName).toContain('Playing with');
  104 |   });
  105 | });
  106 | 
  107 | test.describe('Words and Sentences Page - Per-Animal Checkboxes', () => {
  108 |   test.beforeEach(async ({ page }) => {
  109 |     await page.goto('http://localhost:4200/');
  110 |     await page.evaluate(() => {
  111 |       (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
  112 |     });
  113 |     await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  114 |   });
  115 | 
  116 |   test('should load checkbox state for currently selected animal', async ({ page }) => {
  117 |     await page.goto('http://localhost:4200/');
  118 |     const firstAnimal = await page.locator('.animal-item').first();
  119 |     await firstAnimal.click();
  120 |     
  121 |     await page.evaluate(() => {
  122 |       (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
  123 |     });
  124 |     
  125 |     const checkboxes = await page.locator('.checkbox-container input[type="checkbox"]');
  126 |     await checkboxes.nth(0).click();
  127 |     
  128 |     await page.reload();
  129 |     
  130 |     expect(await checkboxes.nth(0).isChecked()).toBe(true);
  131 |   });
  132 | 
  133 |   test('should not affect other animals when toggling checkboxes', async ({ page }) => {
  134 |     await page.goto('http://localhost:4200/');
  135 |     const animals = await page.locator('.animal-item');
  136 |     
  137 |     await animals.nth(0).click();
  138 |     
  139 |     await page.evaluate(() => {
  140 |       (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
  141 |     });
  142 |     
  143 |     const checkboxes = await page.locator('.checkbox-container input[type="checkbox"]');
  144 |     await checkboxes.nth(0).click();
  145 |     
  146 |     const firstAnimalState = await page.evaluate(() => {
  147 |       const saved = localStorage.getItem('tinyStepsAnimalCheckboxes');
  148 |       if (saved) {
  149 |         return JSON.parse(saved);
  150 |       }
  151 |       return {};
  152 |     });
  153 | 
  154 |     await page.goto('http://localhost:4200/');
  155 |     await animals.nth(1).click();
  156 |     
  157 |     await page.evaluate(() => {
  158 |       (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
  159 |     });
  160 |     
  161 |     const secondAnimalCheckboxes = await page.locator('.checkbox-container input[type="checkbox"]');
  162 |     await secondAnimalCheckboxes.nth(1).click();
  163 |     
  164 |     const newState = await page.evaluate(() => {
  165 |       const saved = localStorage.getItem('tinyStepsAnimalCheckboxes');
  166 |       if (saved) {
  167 |         return JSON.parse(saved);
  168 |       }
  169 |       return {};
  170 |     });
  171 | 
  172 |     expect(Object.keys(newState).length).toBe(2);
  173 |   });
  174 | 
  175 |   test('should show different checkbox states for different animals', async ({ page }) => {
  176 |     await page.goto('http://localhost:4200/');
  177 |     const animals = await page.locator('.animal-item');
  178 |     
  179 |     await animals.nth(0).click();
  180 |     
  181 |     await page.evaluate(() => {
  182 |       (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
  183 |     });
  184 |     
  185 |     const checkboxes1 = await page.locator('.checkbox-container input[type="checkbox"]');
  186 |     await checkboxes1.nth(0).click();
  187 |     
  188 |     await page.goto('http://localhost:4200/');
  189 |     await animals.nth(1).click();
  190 |     
  191 |     await page.evaluate(() => {
  192 |       (window as any).router.navigate(['/sounds-speech/words-and-sentences']);
  193 |     });
  194 |     
  195 |     const checkboxes2 = await page.locator('.checkbox-container input[type="checkbox"]');
  196 |     expect(await checkboxes2.nth(0).isChecked()).toBe(false);
  197 |   });
  198 | });
  199 | 
```