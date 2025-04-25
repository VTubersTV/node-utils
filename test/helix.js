const assert = require('assert');
const { Helix, HelixError } = require('../dist/classes/Helix');
const { buildTest, runTests } = require('./suite');
const crypto = require('crypto');

/**
 * Test suite for Helix ID and token generation
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

    buildTest('Should generate and decode tokens', async () => {
        const helix = new Helix();
        const data = { userId: '123', role: 'admin' };
        const token = helix.generateToken(data);

        // Token should be a string with 3 parts
        assert(typeof token === 'string', 'Token should be a string');
        assert(token.split('.').length === 3, 'Token should have 3 parts');

        // Decode and verify token
        const decoded = Helix.decodeToken(token);
        assert(decoded.id, 'Decoded token should have an ID');
        assert(decoded.version === 1, 'Token version should be 1');
        assert(decoded.timestamp instanceof Date, 'Timestamp should be a Date');
    }),

    buildTest('Should verify HMAC signatures', async () => {
        const payload = 'test-payload';
        const secret = 'test-secret';

        // Generate HMAC using same method as implementation
        const hmac = crypto
            .createHmac('sha256', secret)
            .update(Buffer.from(payload))
            .digest()
            .slice(0, 8)
            .toString('base64url');

        // Verify HMAC
        const isValid = Helix.verifyHMAC(payload, hmac, secret);
        assert(isValid, 'HMAC verification should succeed with correct signature');

        // Verify incorrect HMAC fails
        const isInvalid = Helix.verifyHMAC(payload, 'wrong-signature', secret);
        assert(!isInvalid, 'HMAC verification should fail with incorrect signature');
    }),

    buildTest('Should handle worker ID limits', async () => {
        // Test valid worker ID
        const helix1 = new Helix(123);
        assert(helix1 instanceof Helix, 'Should create instance with valid worker ID');

        // Test invalid worker ID
        try {
            new Helix(1024); // Max is 1023 (10 bits)
            assert.fail('Should throw error for invalid worker ID');
        } catch (err) {
            assert(err instanceof HelixError, 'Should throw HelixError for invalid worker ID');
        }
    }),

    buildTest('Should decode ID components correctly', async () => {
        const helix = new Helix(123);
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

