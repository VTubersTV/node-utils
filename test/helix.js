const assert = require('assert');
const { Helix, HelixError } = require('../dist/classes/Helix');
const { buildTest, runTests } = require('./suite');
const crypto = require('crypto');

/**
 * Test suite for Helix ID and token generation
 * @description Tests the functionality of the Helix distributed ID and token generator
 */
const tests = [
    buildTest('Should generate unique IDs', async () => {
        const helix = new Helix();
        const id1 = helix.generateId();
        const id2 = helix.generateId();
        assert.notStrictEqual(id1, id2, 'Generated IDs should be unique');
    }),

    buildTest('Should generate sequential IDs', async () => {
        const helix = new Helix();
        const id1 = BigInt(helix.generateId());
        const id2 = BigInt(helix.generateId());
        assert(id2 > id1, 'Sequential IDs should be increasing');
    }),

    buildTest('Should generate and verify tokens', async () => {
        const helix = new Helix({ tokenSecret: 'test-secret' });
        const data = { userId: '123', role: 'admin' };
        const token = helix.generateToken(data);

        // Token should be a string with 2 parts
        assert(typeof token === 'string', 'Token should be a string');
        assert(token.split('.').length === 2, 'Token should have 2 parts');

        // Verify and decode token
        const decoded = helix.verifyToken(token);
        assert.deepStrictEqual(decoded, data, 'Decoded token should match original data');
    }),

    buildTest('Should handle token verification failures', async () => {
        const helix = new Helix({ tokenSecret: 'test-secret' });
        const data = { userId: '123', role: 'admin' };
        const token = helix.generateToken(data);

        // Modify token to make it invalid
        const invalidToken = token.slice(0, -1) + 'x';

        try {
            helix.verifyToken(invalidToken);
            assert.fail('Should throw error for invalid token');
        } catch (err) {
            assert(err instanceof HelixError, 'Should throw HelixError for invalid token');
        }
    }),

    buildTest('Should handle worker ID limits', async () => {
        // Test valid worker ID
        const helix1 = new Helix({ workerId: 123 });
        assert(helix1 instanceof Helix, 'Should create instance with valid worker ID');

        // Test invalid worker ID
        try {
            new Helix({ workerId: 1024 }); // Max is 1023 (10 bits)
            assert.fail('Should throw error for invalid worker ID');
        } catch (err) {
            assert(err instanceof HelixError, 'Should throw HelixError for invalid worker ID');
        }
    }),

    buildTest('Should decode ID components correctly', async () => {
        const helix = new Helix({ workerId: 123 });
        const id = BigInt(helix.generateId());
        const decoded = Helix.decodeId(id);

        assert(decoded.timestamp instanceof Date, 'Should decode timestamp as Date');
        assert(decoded.workerId === 123, 'Should decode correct worker ID');
        assert(typeof decoded.sequence === 'number', 'Should decode sequence number');
        assert(decoded.sequence >= 0 && decoded.sequence <= 4095, 'Sequence should be within valid range');
    })
];

// Run the tests
runTests(tests).catch(err => {
    console.error('Test suite failed:', err);
    process.exit(1);
});

