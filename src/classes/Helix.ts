import os from 'os';
import crypto from 'crypto';

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
        this.tokenSecret = options.tokenSecret || '';

        // Allow manual worker ID override, otherwise auto-generate
        this.workerId = options.workerId ?? this.generateWorkerId();

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
        let timestamp = Date.now();

        if (timestamp < this.lastTimestamp) {
            throw new HelixError(
                `Clock moved backwards by ${this.lastTimestamp - timestamp}ms`
            );
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & Helix.MAX_SEQUENCE;
            if (this.sequence === 0) {
                timestamp = this.waitForNextMillis(timestamp);
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = timestamp;

        const id = (BigInt(timestamp - Helix.EPOCH) << BigInt(Helix.TIMESTAMP_SHIFT)) |
                  (BigInt(this.workerId) << BigInt(Helix.WORKER_ID_SHIFT)) |
                  BigInt(this.sequence);

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
     * Waits until the next millisecond
     * @param currentTime Current timestamp in milliseconds
     * @returns Next millisecond timestamp
     */
    private waitForNextMillis(currentTime: number): number {
        let timestamp = Date.now();
        while (timestamp <= currentTime) {
            timestamp = Date.now();
        }
        return timestamp;
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