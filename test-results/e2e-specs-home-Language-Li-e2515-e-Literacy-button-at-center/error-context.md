# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/specs/home.spec.ts >> Language & Literacy - Button Repositioning >> should position Language & Literacy button at center
- Location: e2e/specs/home.spec.ts:394:7

# Error details

```
Error: expect(received).toBeLessThan(expected)

Expected: < 330
Received:   570
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
  306 |   });
  307 | 
  308 |   test('should display subcategories in horizontal linear layout', async ({ page }) => {
  309 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  310 |     await languageLiteracyBtn.click();
  311 |     
  312 |     const subcategoryContainer = await page.locator('.subcategory-container');
  313 |     const layout = await subcategoryContainer.evaluate((el: HTMLElement) => {
  314 |       return window.getComputedStyle(el).display;
  315 |     });
  316 |     
  317 |     expect(layout).toBe('flex');
  318 |   });
  319 | 
  320 |   test('should have Sounds and Speech subcategory button', async ({ page }) => {
  321 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  322 |     await languageLiteracyBtn.click();
  323 |     
  324 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  325 |     await expect(soundsSpeechBtn).toBeVisible();
  326 |   });
  327 | 
  328 |   test('should have Comprehension subcategory button', async ({ page }) => {
  329 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  330 |     await languageLiteracyBtn.click();
  331 |     
  332 |     const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
  333 |     await expect(comprehensionBtn).toBeVisible();
  334 |   });
  335 | 
  336 |   test('should position sounds and speech button before comprehension', async ({ page }) => {
  337 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  338 |     await languageLiteracyBtn.click();
  339 |     
  340 |     const soundsSpeechBtn = await page.locator('.sub-nav-button:has-text("Sounds and speech")');
  341 |     const comprehensionBtn = await page.locator('.sub-nav-button:has-text("Comprehension")');
  342 |     
  343 |     const soundsSpeechBox = await soundsSpeechBtn.boundingBox();
  344 |     const comprehensionBox = await comprehensionBtn.boundingBox();
  345 |     
  346 |     expect(soundsSpeechBox?.x).toBeLessThan(comprehensionBox!.x);
  347 |   });
  348 | 
  349 |   test('should have round subcategory buttons', async ({ page }) => {
  350 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  351 |     await languageLiteracyBtn.click();
  352 |     
  353 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  354 |     await soundsSpeechBtn.click();
  355 |     
  356 |     // Get the computed border-radius to verify it's round (50%)
  357 |     const borderRadius = await soundsSpeechBtn.evaluate((el: HTMLElement) => {
  358 |       return window.getComputedStyle(el).borderRadius;
  359 |     });
  360 |     
  361 |     // Round buttons have 50% border-radius
  362 |     expect(borderRadius).toContain('50%');
  363 |   });
  364 | 
  365 |   test('should have equal width and height for subcategory buttons', async ({ page }) => {
  366 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  367 |     await languageLiteracyBtn.click();
  368 |     
  369 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  370 |     
  371 |     const box = await soundsSpeechBtn.boundingBox();
  372 |     
  373 |     // Buttons should be square (round means equal dimensions)
  374 |     expect(box?.width).toBeCloseTo(box?.height, 0);
  375 |   });
  376 | 
  377 |   test('should hide subcategories when clicking Language & Literacy again', async ({ page }) => {
  378 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  379 |     await languageLiteracyBtn.click();
  380 |     
  381 |     const subcategoryContainer = await page.locator('.subcategory-container');
  382 |     await expect(subcategoryContainer).toBeVisible();
  383 |     
  384 |     await languageLiteracyBtn.click();
  385 |     await expect(subcategoryContainer).not.toBeVisible();
  386 |   });
  387 | });
  388 | 
  389 | test.describe('Language & Literacy - Button Repositioning', () => {
  390 |   test.beforeEach(async ({ page }) => {
  391 |     await page.goto('http://localhost:4200/');
  392 |   });
  393 | 
  394 |   test('should position Language & Literacy button at center', async ({ page }) => {
  395 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  396 |     
  397 |     // Language & Literacy button is always visible at center (0deg)
  398 |     await expect(languageLiteracyBtn).toBeVisible();
  399 |     
  400 |     // Check the button is roughly centered (allow for button size)
  401 |     const btnPos = await languageLiteracyBtn.boundingBox();
  402 |     
  403 |     // With circle size of 500px and button of ~140px,
  404 |     // center should be around x=250, with tolerance for rounding
  405 |     expect(btnPos?.x).toBeGreaterThan(170);
> 406 |     expect(btnPos?.x).toBeLessThan(330);
      |                       ^ Error: expect(received).toBeLessThan(expected)
  407 |   });
  408 | 
  409 |   test('should have Maths & Numbers button at correct position', async ({ page }) => {
  410 |     const mathsBtn = await page.locator('.nav-item.item-2 .nav-button');
  411 |     expect(await mathsBtn.textContent()).toContain('Maths & Numbers');
  412 |     
  413 |     // The button should be at 72deg rotation position (upper right quadrant)
  414 |     const pos = await mathsBtn.boundingBox();
  415 |     
  416 |     // At 72deg, button should be in upper-right quadrant (y=140px from center)
  417 |     // Circle radius is 250px, so y should be around 110-140 range
  418 |     expect(pos?.x).toBeGreaterThan(250); // Right of center
  419 |     expect(pos?.y).toBeLessThan(380);     // Allow for 72deg calculation variation
  420 |     expect(pos?.y).toBeGreaterThan(20);   // Should be near top
  421 |   });
  422 |   
  423 |   test('should have Social/Emotional button at correct position', async ({ page }) => {
  424 |     const socialBtn = await page.locator('.nav-item.item-3 .nav-button');
  425 |     expect(await socialBtn.textContent()).toContain('Social/Emotional');
  426 |   });
  427 | 
  428 |   test('should have Physical button at top position', async ({ page }) => {
  429 |     const physicalBtn = await page.locator('.nav-item.item-4 .nav-button');
  430 |     expect(await physicalBtn.textContent()).toContain('Physical');
  431 |   });
  432 | 
  433 |   test('should have Executive Function button at correct position', async ({ page }) => {
  434 |     const execBtn = await page.locator('.nav-item.item-5 .nav-button');
  435 |     expect(await execBtn.textContent()).toContain('Executive Function');
  436 |   });
  437 | });
  438 | 
  439 | test.describe('Speech and Sound - Navigation', () => {
  440 |   test.beforeEach(async ({ page }) => {
  441 |     await page.goto('http://localhost:4200/');
  442 |   });
  443 | 
  444 |   test('should navigate to sounds-speech page when clicking Sounds and Speech subcategory', async ({ page }) => {
  445 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  446 |     await languageLiteracyBtn.click();
  447 |     
  448 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  449 |     await soundsSpeechBtn.click();
  450 |     
  451 |     // Wait for navigation to complete
  452 |     await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  453 |     
  454 |     const url = page.url();
  455 |     expect(url).toContain('sounds-speech/words-and-sentences');
  456 |   });
  457 | 
  458 |   test('should navigate to comprehension page when clicking Comprehension subcategory', async ({ page }) => {
  459 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  460 |     await languageLiteracyBtn.click();
  461 |     
  462 |     const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
  463 |     await comprehensionBtn.click();
  464 |     
  465 |     // Wait for navigation to complete
  466 |     await page.waitForSelector('app-comprehension', { timeout: 5000 });
  467 |     
  468 |     const url = page.url();
  469 |     expect(url).toContain('comprehension');
  470 |   });
  471 | 
  472 |   test('should have working back navigation from sounds-speech page', async ({ page }) => {
  473 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  474 |     await languageLiteracyBtn.click();
  475 |     
  476 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  477 |     await soundsSpeechBtn.click();
  478 |     
  479 |     await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  480 |     
  481 |     const backBtn = await page.locator('.nav-back');
  482 |     expect(backBtn).toBeVisible();
  483 |   });
  484 | 
  485 |   test('should preserve animal selection through navigation to sounds-speech', async ({ page }) => {
  486 |     const firstAnimal = await page.locator('.animal-item').first();
  487 |     await firstAnimal.click();
  488 |     
  489 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  490 |     await languageLiteracyBtn.click();
  491 |     
  492 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  493 |     await soundsSpeechBtn.click();
  494 |     
  495 |     await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  496 |     
  497 |     // Verify animal selection persists
  498 |     const selectedAnimal = await page.locator('.selected-animal-icon');
  499 |     expect(selectedAnimal).toBeVisible();
  500 |   });
  501 | });
  502 | 
```