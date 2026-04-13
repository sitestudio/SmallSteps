# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/specs/home.spec.ts >> Speech and Sound - Navigation >> should preserve animal selection through navigation to sounds-speech
- Location: e2e/specs/home.spec.ts:485:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('.selected-animal-icon')
Expected: visible
Received: undefined

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.selected-animal-icon')

```

# Test source

```ts
  399 |     
  400 |     // Check the button is roughly centered (allow for button size)
  401 |     const btnPos = await languageLiteracyBtn.boundingBox();
  402 |     
  403 |     // With circle size of 500px and button of ~140px,
  404 |     // center should be around x=250, with tolerance for rounding
  405 |     expect(btnPos?.x).toBeGreaterThan(170);
  406 |     expect(btnPos?.x).toBeLessThan(330);
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
> 499 |     expect(selectedAnimal).toBeVisible();
      |                            ^ Error: expect(locator).toBeVisible() failed
  500 |   });
  501 | });
  502 | 
```