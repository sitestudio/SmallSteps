// agent-browser CLI version of comprehension tests

const SESSION_NAME = 'tiny-steps-e2e';
const BASE_URL = 'http://localhost:4200';

module.exports = {
  name: 'comprehension page',
  commands: [
    `open ${BASE_URL}/`,
    
    // Navigate to comprehension via subcategory
    'click .nav-item.item-1 a.nav-button',
    `wait contains "Comprehension"`,
    'click .sub-nav-button:has-text("Comprehension")',
    
    `wait app-comprehension --timeout 5000`,
    `is visible app-comprehension`,
    
    // Verify checklist items exist
    'find all .checklist-item count greater than 0',
    
    // Verify PDF button
    'is visible .btn-primary:has-text("Download PDF")',
    
    // Verify dark mode toggle
    'is visible .settings-panel input[type="checkbox"]',
  ]
};
