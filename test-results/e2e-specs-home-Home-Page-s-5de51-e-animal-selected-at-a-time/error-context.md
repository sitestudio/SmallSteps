# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/specs/home.spec.ts >> Home Page >> should allow only one animal selected at a time
- Location: e2e/specs/home.spec.ts:58:7

# Error details

```
Error: expect(locator).not.toHaveClass(expected) failed

Locator: locator('.animal-item').first()
Expected pattern: not /selected/
Received string: "animal-item selected"
Timeout: 5000ms

Call log:
  - Expect "not toHaveClass" with timeout 5000ms
  - waiting for locator('.animal-item').first()
    9 × locator resolved to <div _ngcontent-ng-c1781022207="" class="animal-item selected">…</div>
      - unexpected value "animal-item selected"

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
      - generic [ref=e39]: Animals You've Started With
      - generic [ref=e40]:
        - generic [ref=e42] [cursor=pointer]:
          - img "Tiger" [ref=e43]
          - generic [ref=e44]: Tiger
        - button [ref=e45] [cursor=pointer]:
          - img [ref=e46]
      - generic [ref=e49]: Animals to Try
      - generic [ref=e50]:
        - generic [ref=e51] [cursor=pointer]:
          - img "Lion" [ref=e52]
          - generic [ref=e53]: Lion
        - generic [ref=e54] [cursor=pointer]:
          - img "Elephant" [ref=e55]
          - generic [ref=e56]: Elephant
        - generic [ref=e57] [cursor=pointer]:
          - img "Bear" [ref=e58]
          - generic [ref=e59]: Bear
        - generic [ref=e60] [cursor=pointer]:
          - img "Zebra" [ref=e61]
          - generic [ref=e62]: Zebra
        - generic [ref=e63] [cursor=pointer]:
          - img "Giraffe" [ref=e64]
          - generic [ref=e65]: Giraffe
        - generic [ref=e66] [cursor=pointer]:
          - img "Monkey" [ref=e67]
          - generic [ref=e68]: Monkey
        - generic [ref=e69] [cursor=pointer]:
          - img "Kangaroo" [ref=e70]
          - generic [ref=e71]: Kangaroo
        - generic [ref=e72] [cursor=pointer]:
          - img "Panda" [ref=e73]
          - generic [ref=e74]: Panda
        - generic [ref=e75] [cursor=pointer]:
          - img "Koala" [ref=e76]
          - generic [ref=e77]: Koala
        - generic [ref=e78] [cursor=pointer]:
          - img "Hippo" [ref=e79]
          - generic [ref=e80]: Hippo
        - generic [ref=e81] [cursor=pointer]:
          - img "Rhino" [ref=e82]
          - generic [ref=e83]: Rhino
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Home Page', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('http://localhost:4200/');
  6   |   });
  7   | 
  8   |   test('should display the home page content', async ({ page }) => {
  9   |     await expect(page.locator('app-home')).toBeVisible();
  10  |   });
  11  | 
  12  |   test('should have navigation buttons', async ({ page }) => {
  13  |     await expect(page.locator('app-home')).toContainText(/Home|Training/i);
  14  |   });
  15  | 
  16  |   test('should display all 12 animals', async ({ page }) => {
  17  |     const animalItems = await page.locator('.animal-item');
  18  |     expect(await animalItems.count()).toBe(12);
  19  |   });
  20  | 
  21  |   test('should display animal names correctly', async ({ page }) => {
  22  |     const firstAnimal = await page.locator('.animal-item').first();
  23  |     await expect(firstAnimal.locator('.animal-name')).toContainText('Lion');
  24  |   });
  25  | 
  26  |   test('should display animal icons', async ({ page }) => {
  27  |     const animalIcons = await page.locator('.animal-icon');
  28  |     expect(await animalIcons.count()).toBe(12);
  29  |   });
  30  | 
  31  |   test('should show unchecked state by default', async ({ page }) => {
  32  |     const animalItems = await page.locator('.animal-item');
  33  |     
  34  |     for (let i = 0; i < 12; i++) {
  35  |       await expect(animalItems.nth(i)).not.toHaveClass(/selected/);
  36  |     }
  37  |   });
  38  | 
  39  |   test('should select animal when clicked', async ({ page }) => {
  40  |     const firstAnimal = await page.locator('.animal-item').first();
  41  |     
  42  |     await expect(firstAnimal).not.toHaveClass(/selected/);
  43  |     await firstAnimal.click();
  44  |     
  45  |     await expect(firstAnimal).toHaveClass(/selected/);
  46  |   });
  47  | 
  48  |   test('should toggle off when clicking already selected animal', async ({ page }) => {
  49  |     const firstAnimal = await page.locator('.animal-item').first();
  50  |     
  51  |     await firstAnimal.click();
  52  |     await expect(firstAnimal).toHaveClass(/selected/);
  53  |     
  54  |     await firstAnimal.click();
  55  |     await expect(firstAnimal).not.toHaveClass(/selected/);
  56  |   });
  57  | 
  58  |   test('should allow only one animal selected at a time', async ({ page }) => {
  59  |     // Navigate to home
  60  |     await page.goto('http://localhost:4200/');
  61  |     
  62  |     // Wait for home component
  63  |     await expect(page.locator('app-home')).toBeVisible();
  64  |     
  65  |     // Get initial animals (all 12 in unchecked section)
  66  |     const animals1 = await page.locator('.animal-item');
  67  |     // console.log('Animal count:', await animals1.count());
  68  |     
  69  |     // Click first animal (animal-0)
  70  |     await animals1.nth(0).click();
  71  |     // console.log('Clicked animal 0');
  72  |     
  73  |     // Wait for DOM to update
  74  |     await page.waitForTimeout(500);
  75  |     
  76  |     const class1 = await animals1.nth(0).getAttribute('class');
  77  |     // console.log('After click 0, animal 0 class:', class1);
  78  |     
  79  |     await expect(animals1.nth(0)).toHaveClass(/selected/);
  80  |     
  81  |     // Re-acquire animals since DOM changed
  82  |     const animals2 = await page.locator('.animal-item');
  83  |     
  84  |     // After first click: 
  85  |     // - animals2.nth(0) = animal-0 (selected, now in checked section)
  86  |     // - animals2.nth(1) = animal-1 (in unchecked section, should be selected)
  87  |     
  88  |     // Click the second animal (animal-1) 
  89  |     await animals2.nth(1).click();
  90  |     // console.log('Clicked animal 1');
  91  |     
  92  |     // Wait for DOM to update
  93  |     await page.waitForTimeout(500);
  94  |     
  95  |     // Check that animal 0 is no longer selected
> 96  |     await expect(animals2.nth(0)).not.toHaveClass(/selected/);  // animal-0 should be deselected
      |                                       ^ Error: expect(locator).not.toHaveClass(expected) failed
  97  |     await expect(animals2.nth(1)).toHaveClass(/selected/);  // animal-1 should be selected
  98  |   });
  99  | 
  100 |   test('should persist selection after page reload', async ({ page }) => {
  101 |     const firstAnimal = await page.locator('.animal-item').first();
  102 |     
  103 |     await firstAnimal.click();
  104 |     await expect(firstAnimal).toHaveClass(/selected/);
  105 |     
  106 |     await page.reload();
  107 |     
  108 |     await expect(firstAnimal).toHaveClass(/selected/);
  109 |   });
  110 | 
  111 |   test('should show delete button once after all checked animals', async ({ page }) => {
  112 |     const firstAnimal = await page.locator('.animal-item').first();
  113 |     
  114 |     await firstAnimal.click();
  115 |     await expect(firstAnimal).toHaveClass(/selected/);
  116 |     
  117 |     const deleteBtn = page.locator('.delete-btn');
  118 |     await expect(deleteBtn).toBeVisible();
  119 |   });
  120 | 
  121 |   test('should not show delete button when no animal selected', async ({ page }) => {
  122 |     const deleteBtn = page.locator('.delete-btn');
  123 |     await expect(deleteBtn).not.toBeVisible();
  124 |   });
  125 | 
  126 |   test('should delete selected animal when delete button clicked', async ({ page }) => {
  127 |     const firstAnimal = await page.locator('.animal-item').first();
  128 |     
  129 |     await firstAnimal.click();
  130 |     const deleteBtn = page.locator('.delete-btn');
  131 |     await expect(deleteBtn).toBeVisible();
  132 |     
  133 |     await deleteBtn.click();
  134 |     
  135 |     const cancelBtn = page.locator('button:has-text("Cancel")');
  136 |     if (await cancelBtn.count() > 0) {
  137 |       await cancelBtn.click();
  138 |     }
  139 |     
  140 |     await expect(firstAnimal).not.toHaveClass(/selected/);
  141 |   });
  142 | });
  143 | 
  144 | test.describe('Subcategory Button Sizing', () => {
  145 |   test.beforeEach(async ({ page }) => {
  146 |     await page.goto('http://localhost:4200/');
  147 |   });
  148 | 
  149 |   test('should have at least 3px border from text edge on subcategory buttons', async ({ page }) => {
  150 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  151 |     await languageLiteracyBtn.click();
  152 |     
  153 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  154 |     await soundsSpeechBtn.click();
  155 |     
  156 |     // Get button dimensions (64x64) and content bounding box
  157 |     const buttonBox = await soundsSpeechBtn.boundingBox();
  158 |     
  159 |     // The span with text should have padding of at least 8px (horizontal) and 10px (vertical)
  160 |     // This means the text should be at least 8-10px from each edge
  161 |     const computedStyle = await soundsSpeechBtn.evaluate((el: HTMLElement) => {
  162 |       return window.getComputedStyle(el);
  163 |     });
  164 |     
  165 |     // Check that the padding exists (box-sizing should be border-box)
  166 |     expect(computedStyle.boxSizing).toBe('border-box');
  167 |     
  168 |     // Button should be square (64x64)
  169 |     expect(buttonBox?.width).toBe(64);
  170 |     expect(buttonBox?.height).toBe(64);
  171 |   });
  172 | 
  173 |   test('should have equal width and height for all subcategory buttons', async ({ page }) => {
  174 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  175 |     await languageLiteracyBtn.click();
  176 |     
  177 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  178 |     const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
  179 |     
  180 |     const soundsSpeechBox = await soundsSpeechBtn.boundingBox();
  181 |     const comprehensionBox = await comprehensionBtn.boundingBox();
  182 |     
  183 |     // Both buttons should have the same dimensions
  184 |     expect(soundsSpeechBox?.width).toBe(comprehensionBox?.width);
  185 |     expect(soundsSpeechBox?.height).toBe(comprehensionBox?.height);
  186 |     
  187 |     // Both should be 64x64
  188 |     expect(soundsSpeechBox?.width).toBe(64);
  189 |     expect(soundsSpeechBox?.height).toBe(64);
  190 |   });
  191 | 
  192 |   test('should all have the same border radius (circular)', async ({ page }) => {
  193 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  194 |     await languageLiteracyBtn.click();
  195 |     
  196 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
```