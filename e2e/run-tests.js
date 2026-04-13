const { execSync } = require('child_process');
const SESSION_NAME = 'smse2e';
const BASE_URL = 'http://localhost:4200';

function runTest(testName, commands) {
  console.log(`\n=== Running ${testName} ===`);
  
  try {
    execSync(`agent-browser --session ${SESSION_NAME} close 2>/dev/null || true`);
    
    for (const cmd of commands) {
      const fullCmd = `agent-browser --session ${SESSION_NAME} ${cmd}`;
      console.log(fullCmd);
      
      try {
        const output = execSync(fullCmd, { encoding: 'utf-8' });
        console.log(output);
      } catch (err) {
        execSync(`agent-browser --session ${SESSION_NAME} screenshot test-results/${testName}-failed.png`);
        console.error(`Test failed: ${err.message}`);
        process.exit(1);
      }
    }
    
    console.log(`✓ ${testName} passed`);
  } catch (error) {
    console.error(`✗ ${testName} errored:`, error.message);
    process.exit(1);
  }
}

const tests = [
  {
    name: 'home page',
    commands: [
      `open ${BASE_URL}/home`,
      `wait app-home --timeout 5000`,
      `is visible app-home`
    ]
  },
  {
    name: 'literacy first page',
    commands: [
      `open ${BASE_URL}/training/literacy-first`,
      `wait app-literacy-first --timeout 5000`,
      `is visible app-literacy-first`
    ]
  },
  {
    name: 'words and sentences page',
    commands: [
      `open ${BASE_URL}/sounds-speech/words-and-sentences`,
      `wait app-words-and-sentences --timeout 5000`,
      `is visible app-words-and-sentences`
    ]
  }
];

let failed = false;
for (const test of tests) {
  try {
    runTest(test.name, test.commands);
  } catch (e) {
    failed = true;
  }
}

console.log('\n=== Test Summary ===');
const passedCount = tests.length - (failed ? 1 : 0);
console.log(`${passedCount}/${tests.length} tests passed`);

process.exit(failed ? 1 : 0);
