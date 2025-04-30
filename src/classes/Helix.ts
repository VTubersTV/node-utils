import os from 'os';
import crypto from 'crypto';
import { performance } from 'perf_hooks';

/**
 * Custom error class for Helix-specific errors
 */
export class HelixError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'HelixError';
    }
}

/**
 * Helix - A high-performance distributed unique ID and token generator
 *
 * Features:
 * - Generates unique, sortable, distributed IDs (Snowflake format)
 * - Creates secure, verifiable tokens with embedded JSON data
 * - Simple two-part token format: <base64url(data)>.<hmac_signature>
 *
 * ID Structure (64 bits):
 * - 42 bits: Timestamp (milliseconds since custom epoch)
 * - 10 bits: Worker/Instance ID (supports up to 1024 instances)
 * - 12 bits: Sequence number (up to 4096 IDs per millisecond)
 */
export class Helix {
    // Custom epoch (2015-01-01T00:00:00.000Z)
    private static readonly EPOCH = 1420070400000;

    // Bit allocation
    private static readonly TIMESTAMP_BITS = 42;
    private static readonly WORKER_ID_BITS = 10;
    private static readonly SEQUENCE_BITS = 12;

    // Derived constants
    private static readonly MAX_WORKER_ID = (1 << Helix.WORKER_ID_BITS) - 1;
    private static readonly MAX_SEQUENCE = (1 << Helix.SEQUENCE_BITS) - 1;
    private static readonly TIMESTAMP_SHIFT = Helix.WORKER_ID_BITS + Helix.SEQUENCE_BITS;
    private static readonly WORKER_ID_SHIFT = Helix.SEQUENCE_BITS;

    private readonly workerId: number;
    private sequence: number;
    private lastTimestamp: number;
    private readonly tokenSecret: string;
    private readonly performanceNow: () => number;
    private readonly timestampMask: bigint;
    private readonly workerIdMask: bigint;
    private readonly sequenceMask: bigint;
    private readonly workerIdShifted: bigint;
    private lastTimeHigh: number;
    private lastTimeLow: number;

    /**
     * Creates a new Helix instance
     * @param options Configuration options for Helix
     * @param options.workerId Optional manual worker ID override (0-1023)
     * @param options.tokenSecret Secret key for token signing (required for token operations)
     * @throws {HelixError} If worker ID exceeds maximum allowed value
     */
    constructor(options: { workerId?: number; tokenSecret?: string } = {}) {
        this.sequence = 0;
        this.lastTimestamp = -1;
        this.lastTimeHigh = 0;
        this.lastTimeLow = 0;
        this.tokenSecret = options.tokenSecret || '';
        this.performanceNow = performance.now.bind(performance);

        // Initialize worker ID
        this.workerId = options.workerId ?? this.generateWorkerId();

        // Pre-calculate masks and shifts for faster bit operations
        this.timestampMask = (BigInt(1) << BigInt(Helix.TIMESTAMP_BITS)) - BigInt(1);
        this.workerIdMask = (BigInt(1) << BigInt(Helix.WORKER_ID_BITS)) - BigInt(1);
        this.sequenceMask = (BigInt(1) << BigInt(Helix.SEQUENCE_BITS)) - BigInt(1);
        this.workerIdShifted = BigInt(this.workerId) << BigInt(Helix.WORKER_ID_SHIFT);

        if (this.workerId > Helix.MAX_WORKER_ID) {
            throw new HelixError(
                `Worker ID ${this.workerId} exceeds maximum allowed value ${Helix.MAX_WORKER_ID}`
            );
        }
    }

    /**
     * Generates a unique 64-bit ID in Snowflake format
     * @returns A string representation of the generated ID
     */
    public generateId(): string {
        // Get high-precision timestamp
        const now = this.performanceNow();
        const timestamp = Math.floor(now);

        // Split timestamp into high and low parts for faster comparison
        const timeHigh = Math.floor(timestamp / 1000);
        const timeLow = timestamp % 1000;

        if (timeHigh < this.lastTimeHigh || (timeHigh === this.lastTimeHigh && timeLow < this.lastTimeLow)) {
            throw new HelixError(
                `Clock moved backwards by ${(this.lastTimeHigh * 1000 + this.lastTimeLow) - (timeHigh * 1000 + timeLow)}ms`
            );
        }

        if (timeHigh === this.lastTimeHigh && timeLow === this.lastTimeLow) {
            this.sequence = (this.sequence + 1) & Helix.MAX_SEQUENCE;
            if (this.sequence === 0) {
                // Use a more efficient wait mechanism with microsecond precision
                let nextTime = this.performanceNow();
                while (nextTime <= now) {
                    nextTime = this.performanceNow();
                }
                this.lastTimeHigh = Math.floor(nextTime / 1000);
                this.lastTimeLow = nextTime % 1000;
                return this.generateIdWithTimestamp(Math.floor(nextTime));
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimeHigh = timeHigh;
        this.lastTimeLow = timeLow;
        return this.generateIdWithTimestamp(timestamp);
    }

    /**
     * Generates an ID with the given timestamp
     * @param timestamp The timestamp to use
     * @returns A string representation of the generated ID
     */
    private generateIdWithTimestamp(timestamp: number): string {
        // Pre-calculate timestamp offset and use cached workerId shift
        const timestampOffset = BigInt(timestamp - Helix.EPOCH);
        const id = (timestampOffset & this.timestampMask) << BigInt(Helix.TIMESTAMP_SHIFT) |
                  this.workerIdShifted |
                  (BigInt(this.sequence) & this.sequenceMask);

        return id.toString();
    }

    /**
     * Creates a secure token containing JSON data
     * @param data The data to embed in the token
     * @returns A secure token string in the format: base64url(data).signature
     * @throws {HelixError} If token secret is not configured
     */
    public generateToken(data: unknown): string {
        if (!this.tokenSecret) {
            throw new HelixError('Token secret not configured');
        }

        // Convert data to JSON string and encode as base64url
        const jsonData = JSON.stringify(data);
        const payload = Buffer.from(jsonData).toString('base64url');

        // Generate HMAC signature
        const signature = this.signPayload(payload);

        return `${payload}.${signature}`;
    }

    /**
     * Verifies and decodes a token
     * @param token The token string to verify and decode
     * @returns The decoded data from the token
     * @throws {HelixError} If token is invalid or signature verification fails
     */
    public verifyToken<T = unknown>(token: string): T {
        if (!this.tokenSecret) {
            throw new HelixError('Token secret not configured');
        }

        const parts = token.split('.');
        if (parts.length !== 2) {
            throw new HelixError('Invalid token format');
        }

        const [payload, signature] = parts;

        // Verify signature
        const expectedSignature = this.signPayload(payload);
        if (!crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(expectedSignature)
        )) {
            throw new HelixError('Invalid token signature');
        }

        try {
            // Decode payload
            const jsonData = Buffer.from(payload, 'base64url').toString();
            return JSON.parse(jsonData) as T;
        } catch (err) {
            throw new HelixError('Failed to decode token payload');
        }
    }

    /**
     * Decodes a Snowflake ID into its components
     * @param id The ID to decode
     * @returns Object containing timestamp, worker ID and sequence number
     */
    public static decodeId(id: string | bigint): {
        timestamp: Date;
        workerId: number;
        sequence: number;
    } {
        const bigIntId = typeof id === 'string' ? BigInt(id) : id;

        const timestamp = Number(bigIntId >> BigInt(Helix.TIMESTAMP_SHIFT)) + Helix.EPOCH;
        const workerId = Number((bigIntId >> BigInt(Helix.WORKER_ID_SHIFT)) & BigInt(Helix.MAX_WORKER_ID));
        const sequence = Number(bigIntId & BigInt(Helix.MAX_SEQUENCE));

        return {
            timestamp: new Date(timestamp),
            workerId,
            sequence
        };
    }

    /**
     * Signs a payload using HMAC-SHA256
     * @param payload The payload to sign
     * @returns The base64url encoded signature
     */
    private signPayload(payload: string): string {
        return crypto
            .createHmac('sha256', this.tokenSecret)
            .update(payload)
            .digest()
            .toString('base64url');
    }

    /**
     * Generates a deterministic worker ID based on hostname and process ID
     * @returns A worker ID between 0 and MAX_WORKER_ID
     */
    private generateWorkerId(): number {
        const hostIdentifier = `${os.hostname()}:${process.pid}`;
        const hash = crypto.createHash('sha256').update(hostIdentifier).digest();
        return hash.readUInt32BE(0) & Helix.MAX_WORKER_ID;
    }
}

// const helix = new Helix({
//     tokenSecret: 'test-secret'
// });

// console.time('Helix ID Generation');
// const iterations = 1_000_000;
// const ids = new Set<string>();

// for (let i = 0; i < iterations; i++) {
//     const id = helix.generateId();
//     ids.add(id);
// }

// console.timeEnd('Helix ID Generation');

// console.log(`Generated ${iterations.toLocaleString()} unique IDs`);
// console.log(`Unique IDs: ${ids.size.toLocaleString()}`);
// console.log(`Collisions: ${(iterations - ids.size).toLocaleString()}`);
// console.log(`Collision rate: ${((iterations - ids.size) / iterations * 100).toFixed(6)}%`);

// const sampleId = helix.generateId();
// console.log('\nSample ID Analysis:');
// console.log('ID:', sampleId);
// console.log('Decoded:', Helix.decodeId(sampleId));


// const used = process.memoryUsage();
// console.log('\nMemory Usage:');
// for (const [key, value] of Object.entries(used)) {
//     console.log(`${key}: ${(value / 1024 / 1024).toFixed(2)} MB`);
// }
