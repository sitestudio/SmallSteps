// agent-browser CLI version of sounds-speech tests

const SESSION_NAME = 'tiny-steps-e2e';
const BASE_URL = 'http://localhost:4200';

module.exports = {
  name: 'sounds and speech page',
  commands: [
    `open ${BASE_URL}/`,
    
    // Navigate to sounds-speech
    'click .nav-item.item-1 a.nav-button',
    `wait contains "Sounds and speech"`,
    'click .sub-nav-button:has-text("Sounds and speech")',
    
    `wait app-words-and-sentences --timeout 5000`,
    `is visible app-words-and-sentences`,
    
    // Verify checklist items
    'find all .checklist-item count greater than 0',
    
    // Verify dark mode toggle
    'is visible .dark-mode-toggle',
  ]
};
