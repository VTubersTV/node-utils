function buildTest(name, fn) {
    if (typeof fn !== 'function') {
        throw new Error('Test function must be a function');
    }

    return {
        name,
        fn,
        async run() {
            await fn();
        }
    }
}

async function runTests(fns) {
    console.log('Starting Helix tests...\n');
    let totalTests = 0;
    let passedTests = 0;

    /**
     * Helper function to run a test case
     * @param {string} testName - Name of the test
     * @param {Function} testFn - Test function to execute
     */
    async function runTest(testName, testFn) {
        totalTests++;
        try {
            await testFn();
            console.log(`✓ ${testName}`);
            passedTests++;
        } catch (err) {
            console.error(`✗ ${testName}`);
            console.error(`  Error: ${err.message}`);
            if (err.stack) {
                console.error('  Stack:', err.stack.split('\n').slice(1).join('\n'));
            }
        }
    }

    for (const test of fns) {
        await runTest(test.name, test.fn);
    }

    // Print test results
    console.log('\nTest Results:');
    console.log(`Passed: ${passedTests}/${totalTests} tests`);

    // Exit with appropriate code
    process.exit(passedTests === totalTests ? 0 : 1);
}

module.exports = {
    buildTest,
    runTests
};
