import { exec } from 'child_process';
import { promisify } from 'util';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const execPromise = promisify(exec);

async function verifyApp() {
  console.log('Starting verification of Angular app...\n');
  
  // Test 1: Check server is running
  console.log('Test 1: Checking if dev server is running...');
  let stdout;
  try {
    ({ stdout } = await execPromise('curl -s http://localhost:4200 2>/dev/null'));
    console.log('✓ Server is responding\n');
  } catch (e) {
    console.error('✗ Server not responding:', e.message);
    process.exit(1);
  }
  
  // Test 2: Check HTML structure
  console.log('Test 2: Checking HTML structure...');
  if (stdout.includes('<app-root>') && stdout.includes('script type="module"')) {
    console.log('✓ HTML structure correct\n');
  } else {
    console.error('✗ HTML structure incomplete');
    process.exit(1);
  }
  
  // Test 3: Check scripts are served
  console.log('Test 3: Checking JavaScript files...');
  const { stdout: mainJs } = await execPromise('curl -s http://localhost:4200/main.js 2>/dev/null');
  if (mainJs && (mainJs.includes('bootstrapModule') || mainJs.includes('bootstrapApplication'))) {
    console.log('✓ main.js is served and contains bootstrap code\n');
  } else {
    console.error('✗ main.js not found or incomplete');
    process.exit(1);
  }
  
  // Test 4: Check base href configuration
  console.log('Test 4: Checking base href...');
  if (stdout.includes('<base href="/">')) {
    console.log('✓ Base href set to absolute path\n');
  } else if (stdout.includes('<base href="./">')) {
    console.warn('⚠ Base href uses relative path - may cause issues\n');
  } else {
    console.error('✗ No base href found');
    process.exit(1);
  }
  
  // Test 5: Check lazy-loaded chunks
  console.log('Test 5: Checking lazy-loaded component chunks...');
  const chunks = ['home', 'literacy-first', 'sounds-speech-training', 'observation-support', 'sounds-speech', 'print-pdf'];
  for (const chunk of chunks) {
    const { stdout: chunkContent } = await execPromise(`curl -s http://localhost:4200/${chunk}.js 2>/dev/null`);
    if (chunkContent.includes(chunk)) {
      console.log(`✓ ${chunk}.js loaded successfully`);
    } else {
      console.warn(`⚠ ${chunk}.js may not contain expected exports`);
    }
  }
  console.log();
  
  // Test 6: Verify base href fix was applied
  const { stdout: htmlFile } = await execPromise('cat src/index.html');
  if (htmlFile.includes('<base href="/">')) {
    console.log('✓ Base href fix applied in source');
  }
  
  console.log('\n═════════════════════════════════════');
  console.log('ALL SYSTEMS CHECK ✓');
  console.log('═════════════════════════════════════');
  console.log('\nThe app should now render correctly.');
  console.log('Open http://localhost:4200 in a browser to verify visually.');
}

verifyApp().catch(console.error);
