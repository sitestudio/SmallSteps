// agent-browser CLI version of home.spec.ts
// Original Playwright test converted to agent-browser CLI format

const SESSION_NAME = 'smse2e';
const BASE_URL = 'http://localhost:4200';

module.exports = {
  name: 'home page',
  commands: [
    `open ${BASE_URL}/home`,
    `wait app-home --timeout 5000`,
    `is visible app-home`,
    `find first "a" get text`
  ]
};
