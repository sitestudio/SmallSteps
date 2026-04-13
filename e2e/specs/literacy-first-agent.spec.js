// agent-browser CLI version of literacy-first tests

const SESSION_NAME = 'tiny-steps-e2e';
const BASE_URL = 'http://localhost:4200';

module.exports = {
  name: 'literacy first page',
  commands: [
    `open ${BASE_URL}/`,
    
    // Navigate to literacy first
    'click .nav-item.item-1 a.nav-button',
    `wait contains "Sounds and speech"`,
    'click .sub-nav-button:has-text("Sounds and speech")',
    
    `wait app-words-and-sentences --timeout 5000`,
    'click .nav-back',
    
    `wait app-sounds-speech --timeout 5000`,
    'click .nav-btn.nav-home',
    
    `wait app-home --timeout 5000`,
    'click .nav-item.item-1 a.nav-button',
    
    // Click training mode to go to literacy-first
    `is not class .nav-item.item-1 a.nav-button.hidden`,
  ]
};
