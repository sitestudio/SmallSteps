# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/specs/home.spec.ts >> Speech and Sound - Navigation >> should have working back navigation from sounds-speech page
- Location: e2e/specs/home.spec.ts:441:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('.nav-back')
Expected: visible
Received: undefined

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.nav-back')

```

# Test source

```ts
  351 |     await expect(subcategoryContainer).toBeVisible();
  352 |     
  353 |     await languageLiteracyBtn.click();
  354 |     await expect(subcategoryContainer).not.toBeVisible();
  355 |   });
  356 | });
  357 | 
  358 | test.describe('Language & Literacy - Button Repositioning', () => {
  359 |   test.beforeEach(async ({ page }) => {
  360 |     await page.goto('http://localhost:4200/');
  361 |   });
  362 | 
  363 |   test('should position Language & Literacy button at center', async ({ page }) => {
  364 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  365 |     
  366 |     // Language & Literacy button is always visible at center (0deg)
  367 |     await expect(languageLiteracyBtn).toBeVisible();
  368 |     
  369 |     // Check the button is roughly centered (allow for button size)
  370 |     const btnPos = await languageLiteracyBtn.boundingBox();
  371 |     
  372 |     // With circle size of 500px and button of ~140px,
  373 |     // center should be around x=250, with tolerance for rounding
  374 |     expect(btnPos?.x).toBeGreaterThan(170);
  375 |     expect(btnPos?.x).toBeLessThan(330);
  376 |   });
  377 | 
  378 |   test('should have Maths & Numbers button at correct position', async ({ page }) => {
  379 |     const mathsBtn = await page.locator('.nav-item.item-2 .nav-button');
  380 |     expect(await mathsBtn.textContent()).toContain('Maths & Numbers');
  381 |     
  382 |     // The button should be at 72deg rotation position (upper right quadrant)
  383 |     const pos = await mathsBtn.boundingBox();
  384 |     
  385 |     // At 72deg, button should be in upper-right quadrant (y=140px from center)
  386 |     // Circle radius is 250px, so y should be around 110-140 range
  387 |     expect(pos?.x).toBeGreaterThan(250); // Right of center
  388 |     expect(pos?.y).toBeLessThan(380);     // Allow for 72deg calculation variation
  389 |     expect(pos?.y).toBeGreaterThan(20);   // Should be near top
  390 |   });
  391 |   
  392 |   test('should have Social/Emotional button at correct position', async ({ page }) => {
  393 |     const socialBtn = await page.locator('.nav-item.item-3 .nav-button');
  394 |     expect(await socialBtn.textContent()).toContain('Social/Emotional');
  395 |   });
  396 | 
  397 |   test('should have Physical button at top position', async ({ page }) => {
  398 |     const physicalBtn = await page.locator('.nav-item.item-4 .nav-button');
  399 |     expect(await physicalBtn.textContent()).toContain('Physical');
  400 |   });
  401 | 
  402 |   test('should have Executive Function button at correct position', async ({ page }) => {
  403 |     const execBtn = await page.locator('.nav-item.item-5 .nav-button');
  404 |     expect(await execBtn.textContent()).toContain('Executive Function');
  405 |   });
  406 | });
  407 | 
  408 | test.describe('Speech and Sound - Navigation', () => {
  409 |   test.beforeEach(async ({ page }) => {
  410 |     await page.goto('http://localhost:4200/');
  411 |   });
  412 | 
  413 |   test('should navigate to sounds-speech page when clicking Sounds and Speech subcategory', async ({ page }) => {
  414 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  415 |     await languageLiteracyBtn.click();
  416 |     
  417 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  418 |     await soundsSpeechBtn.click();
  419 |     
  420 |     // Wait for navigation to complete
  421 |     await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  422 |     
  423 |     const url = page.url();
  424 |     expect(url).toContain('sounds-speech/words-and-sentences');
  425 |   });
  426 | 
  427 |   test('should navigate to comprehension page when clicking Comprehension subcategory', async ({ page }) => {
  428 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  429 |     await languageLiteracyBtn.click();
  430 |     
  431 |     const comprehensionBtn = page.locator('.sub-nav-button:has-text("Comprehension")');
  432 |     await comprehensionBtn.click();
  433 |     
  434 |     // Wait for navigation to complete
  435 |     await page.waitForSelector('app-comprehension', { timeout: 5000 });
  436 |     
  437 |     const url = page.url();
  438 |     expect(url).toContain('comprehension');
  439 |   });
  440 | 
  441 |   test('should have working back navigation from sounds-speech page', async ({ page }) => {
  442 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  443 |     await languageLiteracyBtn.click();
  444 |     
  445 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  446 |     await soundsSpeechBtn.click();
  447 |     
  448 |     await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  449 |     
  450 |     const backBtn = await page.locator('.nav-back');
> 451 |     expect(backBtn).toBeVisible();
      |                     ^ Error: expect(locator).toBeVisible() failed
  452 |   });
  453 | 
  454 |   test('should preserve animal selection through navigation to sounds-speech', async ({ page }) => {
  455 |     const firstAnimal = await page.locator('.animal-item').first();
  456 |     await firstAnimal.click();
  457 |     
  458 |     const languageLiteracyBtn = await page.locator('.nav-item.item-1 .nav-button');
  459 |     await languageLiteracyBtn.click();
  460 |     
  461 |     const soundsSpeechBtn = page.locator('.sub-nav-button:has-text("Sounds and speech")');
  462 |     await soundsSpeechBtn.click();
  463 |     
  464 |     await page.waitForSelector('app-words-and-sentences', { timeout: 5000 });
  465 |     
  466 |     // Verify animal selection persists
  467 |     const selectedAnimal = await page.locator('.selected-animal-icon');
  468 |     expect(selectedAnimal).toBeVisible();
  469 |   });
  470 | });
  471 | 
```