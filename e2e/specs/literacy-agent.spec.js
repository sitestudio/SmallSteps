// agent-browser CLI version of literacy-first.spec.ts
const SESSION_NAME = 'smse2e';
const BASE_URL = 'http://localhost:4200';

module.exports = {
  name: 'literacy first page',
  commands: [
    `open ${BASE_URL}/training/literacy-first`,
    `wait app-literacy-first --timeout 5000`,
    `is visible app-literacy-first`
  ]
};
