# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/specs/home.spec.ts >> Home Page >> should delete selected animal when delete button clicked
- Location: e2e/specs/home.spec.ts:95:7

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
          - img "Lion" [ref=e43]
          - generic [ref=e44]: Lion
        - button [active] [ref=e45] [cursor=pointer]:
          - img [ref=e46]
      - generic [ref=e49]: Animals to Try
      - generic [ref=e50]:
        - generic [ref=e51] [cursor=pointer]:
          - img "Tiger" [ref=e52]
          - generic [ref=e53]: Tiger
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
  59  |     const animals = await page.locator('.animal-item');
  60  |     
  61  |     await animals.nth(0).click();
  62  |     await expect(animals.nth(0)).toHaveClass(/selected/);
  63  |     
  64  |     await animals.nth(1).click();
  65  |     await expect(animals.nth(0)).not.toHaveClass(/selected/);
  66  |     await expect(animals.nth(1)).toHaveClass(/selected/);
  67  |   });
  68  | 
  69  |   test('should persist selection after page reload', async ({ page }) => {
  70  |     const firstAnimal = await page.locator('.animal-item').first();
  71  |     
  72  |     await firstAnimal.click();
  73  |     await expect(firstAnimal).toHaveClass(/selected/);
  74  |     
  75  |     await page.reload();
  76  |     
  77  |     await expect(firstAnimal).toHaveClass(/selected/);
  78  |   });
  79  | 
  80  |   test('should show delete button once after all checked animals', async ({ page }) => {
  81  |     const firstAnimal = await page.locator('.animal-item').first();
  82  |     
  83  |     await firstAnimal.click();
  84  |     await expect(firstAnimal).toHaveClass(/selected/);
  85  |     
  86  |     const deleteBtn = page.locator('.delete-btn');
  87  |     await expect(deleteBtn).toBeVisible();
  88  |   });
  89  | 
  90  |   test('should not show delete button when no animal selected', async ({ page }) => {
  91  |     const deleteBtn = page.locator('.delete-btn');
  92  |     await expect(deleteBtn).not.toBeVisible();
  93  |   });
  94  | 
  95  |   test('should delete selected animal when delete button clicked', async ({ page }) => {
  96  |     const firstAnimal = await page.locator('.animal-item').first();
  97  |     
  98  |     await firstAnimal.click();
  99  |     const deleteBtn = page.locator('.delete-btn');
  100 |     await expect(deleteBtn).toBeVisible();
  101 |     
  102 |     await deleteBtn.click();
  103 |     
  104 |     const cancelBtn = page.locator('button:has-text("Cancel")');
  105 |     if (await cancelBtn.count() > 0) {
  106 |       await cancelBtn.click();
  107 |     }
  108 |     
> 109 |     await expect(firstAnimal).not.toHaveClass(/selected/);
      |                                   ^ Error: expect(locator).not.toHaveClass(expected) failed
  110 |   });
  111 | });
  112 | 
  113 | test.describe('Subcategory Button Sizing', () => {
  114 |   test.beforeEach(async ({ page }) => {
  115 |     await page.goto('http://localhost:4200/');
  116 |   });
  117 | 
  118 |   test('should have at least 3px border from text edge on subcategory buttons', async ({ page }) => {
  119 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  120 |     await languageLiteracyBtn.click();
  121 |     
  122 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  123 |     await soundsSpeechBtn.click();
  124 |     
  125 |     // Get button dimensions (64x64) and content bounding box
  126 |     const buttonBox = await soundsSpeechBtn.boundingBox();
  127 |     
  128 |     // The span with text should have padding of at least 8px (horizontal) and 10px (vertical)
  129 |     // This means the text should be at least 8-10px from each edge
  130 |     const computedStyle = await soundsSpeechBtn.evaluate((el: HTMLElement) => {
  131 |       return window.getComputedStyle(el);
  132 |     });
  133 |     
  134 |     // Check that the padding exists (box-sizing should be border-box)
  135 |     expect(computedStyle.boxSizing).toBe('border-box');
  136 |     
  137 |     // Button should be square (64x64)
  138 |     expect(buttonBox?.width).toBe(64);
  139 |     expect(buttonBox?.height).toBe(64);
  140 |   });
  141 | 
  142 |   test('should have equal width and height for all subcategory buttons', async ({ page }) => {
  143 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  144 |     await languageLiteracyBtn.click();
  145 |     
  146 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  147 |     const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
  148 |     
  149 |     const soundsSpeechBox = await soundsSpeechBtn.boundingBox();
  150 |     const comprehensionBox = await comprehensionBtn.boundingBox();
  151 |     
  152 |     // Both buttons should have the same dimensions
  153 |     expect(soundsSpeechBox?.width).toBe(comprehensionBox?.width);
  154 |     expect(soundsSpeechBox?.height).toBe(comprehensionBox?.height);
  155 |     
  156 |     // Both should be 64x64
  157 |     expect(soundsSpeechBox?.width).toBe(64);
  158 |     expect(soundsSpeechBox?.height).toBe(64);
  159 |   });
  160 | 
  161 |   test('should all have the same border radius (circular)', async ({ page }) => {
  162 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  163 |     await languageLiteracyBtn.click();
  164 |     
  165 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  166 |     const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
  167 |     
  168 |     const soundsSpeechBorderRadius = await soundsSpeechBtn.evaluate((el: HTMLElement) => {
  169 |       return window.getComputedStyle(el).borderRadius;
  170 |     });
  171 |     
  172 |     const comprehensionBorderRadius = await comprehensionBtn.evaluate((el: HTMLElement) => {
  173 |       return window.getComputedStyle(el).borderRadius;
  174 |     });
  175 |     
  176 |     // All buttons should have 50% border-radius (circular)
  177 |     expect(soundsSpeechBorderRadius).toBe(comprehensionBorderRadius);
  178 |     expect(soundsSpeechBorderRadius).toContain('50%');
  179 |   });
  180 | });
  181 | 
  182 | test.describe('Subcategory Button Colors', () => {
  183 |   test.beforeEach(async ({ page }) => {
  184 |     await page.goto('http://localhost:4200/');
  185 |   });
  186 | 
  187 |   test('should have Sounds and Speech button with correct color (#FF6B6B)', async ({ page }) => {
  188 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  189 |     await languageLiteracyBtn.click();
  190 |     
  191 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  192 |     const computedStyle = await soundsSpeechBtn.evaluate((el: HTMLElement) => {
  193 |       return window.getComputedStyle(el).backgroundColor;
  194 |     });
  195 |     
  196 |     // The button should have red background (#FF6B6B)
  197 |     expect(computedStyle).toBe('rgb(255, 107, 107)');
  198 |   });
  199 | 
  200 |   test('should have Comprehension button with correct color (#4D96FF)', async ({ page }) => {
  201 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  202 |     await languageLiteracyBtn.click();
  203 |     
  204 |     const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
  205 |     const computedStyle = await comprehensionBtn.evaluate((el: HTMLElement) => {
  206 |       return window.getComputedStyle(el).backgroundColor;
  207 |     });
  208 |     
  209 |     // The button should have blue background (#4D96FF)
```