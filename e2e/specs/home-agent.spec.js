// agent-browser CLI version of home.spec.ts
// Original Playwright test converted to agent-browser CLI format

const SESSION_NAME = 'tiny-steps-e2e';
const BASE_URL = 'http://localhost:4200';

module.exports = {
  name: 'home page',
  commands: [
    `open ${BASE_URL}/`,
    `wait app-home --timeout 5000`,
    `is visible app-home`,
    
    // Verify 12 animals are displayed
    'find all .animal-item count equals 12',
    
    // Verify animal names
    `is visible .animal-name:has-text("Lion")`,
    
    // Verify unchecked state by default
    `is not class .animal-item.selected`,
    
    // Click first animal to select
    'click .animal-item:first-child',
    `is class .animalItem.selected`,
    
    // Toggle off
    'click .animal-item:first-child',
    `is not class .animalItem.selected`,
    
    // Only one animal selected at a time
    'click .animal-item:first-child',
    `is class .animalItem.selected`,
    'click .animal-item:nth-child(2)',
    `is not class .animalItem:first-child.selected`,
    `is class .animal-item:nth-child(2).selected`,
    
    // Delete button visibility
    'is visible .delete-btn',
  ]
};
