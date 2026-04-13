// agent-browser CLI version of words-and-sentences.spec.ts
const SESSION_NAME = 'smse2e';
const BASE_URL = 'http://localhost:4200';

module.exports = {
  name: 'words and sentences page',
  
  /**
   * Test setup - navigate from home to words/sentences via Angular router
   */
  setup: [
    `open ${BASE_URL}/home`,
    `wait app-home --timeout 5000`,
    `eval "(window as any).router.navigate(['/sounds-speech/words-and-sentences'])"`,
    `wait app-words-and-sentences --timeout 5000`
  ],
  
  tests: [
    {
      name: 'should display content',
      commands: [`is visible app-words-and-sentences`]
    },
    
    {
      name: 'should display checklist items',
      commands: [
        `get count .checklist-item`,
        // Verify result equals 7
      ]
    },
    
    {
      name: 'should have navigation buttons',
      commands: [
        `is visible .nav-home`,
        `is visible .nav-back`
      ]
    },
    
    {
      name: 'should have proper back link',
      commands: [
        `find role link get text --name "Sounds and Speech"`
      ]
    },
    
    {
      name: 'should expand/collapse description',
      commands: [
        `find role button get text --name "Single Words"`,
        `click $REF$`,  // Replace with actual ref from snapshot
        `is visible .description-content`,
        `click $REF$`,  // Click again to collapse
        `is not visible .description-content`
      ]
    },
    
    {
      name: 'should toggle checkbox state',
      commands: [
        `get value .checkbox-container input[type="checkbox"]`,
        `click $REF$`,  // Replace with actual ref
        `get value .checkbox-container input[type="checkbox"]`
      ]
    }
  ]
};
