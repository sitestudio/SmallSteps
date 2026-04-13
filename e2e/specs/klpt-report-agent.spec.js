// agent-browser CLI version of klpt-report tests

const SESSION_NAME = 'tiny-steps-e2e';
const BASE_URL = 'http://localhost:4200';

module.exports = {
  name: 'klpt report page',
  commands: [
    `open ${BASE_URL}/`,
    
    // Navigate to KLPT report
    'click .nav-item.item-1 a.nav-button',
    `wait contains "Comprehension"`,
    'click .sub-nav-button:has-text("Comprehension")',
    
    `wait app-comprehension --timeout 5000`,
    'click .nav-btn.nav-home',
    
    `wait app-home --timeout 5000`,
    
    // Click lion to select animal
    'click .animal-item:has-text("Lion")',
    
    // Navigate to comprehension and check a checkbox
    'click .nav-item.item-1 a.nav-button',
    `wait contains "Comprehension"`,
    'click .sub-nav-button:has-text("Comprehension")',
    
    `wait app-comprehension --timeout 5000`,
    'click .checklist-item input:first-child',
    
    // Go to KLPT report
    `open ${BASE_URL}/klpt-report`,
    `wait app-klpt-report --timeout 5000`,
    `is visible app-klpt-report`,
    
    // Verify animal name is shown
    'is visible .animal-section h2:has-text("Lion")',
    
    // Verify PDF download button
    'is visible .btn-download:has-text("Download PDF")',
  ]
};
