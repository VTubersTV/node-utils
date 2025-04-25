# Helix ID & Token Generator

A high-performance distributed unique ID and token generator with a simple, secure token format.

## Features

- **Distributed ID Generation**: Generates unique, sortable, distributed IDs in Snowflake format
- **Simple Token Format**: Two-part tokens with JSON payload and HMAC signature
- **Type-Safe**: Full TypeScript support with generic token data types
- **High Performance**: Can generate thousands of unique IDs per millisecond per instance
- **Clock Drift Handling**: Detects and handles system clock changes
- **Worker ID Management**: Supports up to 1024 distributed instances

## Installation

```bash
pnpm add @vtubers.tv/node-utils
```

## Quick Start

```typescript
import { Helix } from '@vtubers.tv/node-utils';

// Create a Helix instance with a token secret
const helix = new Helix({
    tokenSecret: 'your-secret-key'
});

// Generate a unique ID
const id = helix.generateId();

// Create a token with data
const token = helix.generateToken({
    userId: '123',
    role: 'admin',
    exp: Date.now() + 3600000 // 1 hour expiration
});

// Verify and decode a token
const data = helix.verifyToken(token);
```

## ID Generation

### ID Structure (64 bits)

```
+------------------+------------------+------------------+
|    Timestamp     |    Worker ID    |    Sequence     |
|    (42 bits)     |    (10 bits)    |    (12 bits)    |
+------------------+------------------+------------------+
```

- **Timestamp**: 42 bits - milliseconds since 2015-01-01T00:00:00.000Z
- **Worker ID**: 10 bits - supports up to 1024 instances (0-1023)
- **Sequence**: 12 bits - up to 4096 IDs per millisecond

### Example

```typescript
// Generate an ID
const id = helix.generateId();

// Decode an ID
const decoded = Helix.decodeId(id);
console.log(decoded);
// {
//   timestamp: Date,    // When the ID was generated
//   workerId: number,   // Which instance generated it
//   sequence: number    // Sequence number within the millisecond
// }
```

## Token Generation

### Token Format

```
<base64url(JSON data)>.<HMAC signature>
```

- **Part 1**: Base64URL-encoded JSON data
- **Part 2**: HMAC-SHA256 signature (base64url encoded)

### Example

```typescript
// Create a token with typed data
interface UserToken {
    userId: string;
    roles: string[];
    exp: number;
}

const helix = new Helix({ tokenSecret: 'your-secret-key' });

const token = helix.generateToken<UserToken>({
    userId: '123',
    roles: ['admin', 'user'],
    exp: Date.now() + 3600000
});

// Verify and decode with type safety
const data = helix.verifyToken<UserToken>(token);
console.log(data.roles); // TypeScript knows this is string[]
```

## Configuration

### Constructor Options

```typescript
const helix = new Helix({
    // Optional: Manual worker ID (0-1023)
    workerId?: number;
    
    // Required for token operations: Secret key for signing tokens
    tokenSecret?: string;
});
```

### Worker ID Generation

If no manual worker ID is provided, Helix generates a deterministic worker ID based on:
- Hostname
- Process ID (PID)

This ensures consistent worker IDs across process restarts while still providing good distribution in clustered environments.

## Error Handling

```typescript
import { HelixError } from '@vtubers.tv/node-utils';

try {
    const token = helix.generateToken(data);
} catch (err) {
    if (err instanceof HelixError) {
        // Handle Helix-specific errors
        console.error(err.message);
    }
}
```

Common errors:
- `Token secret not configured` - Attempting token operations without a secret
- `Invalid token format` - Token doesn't match expected format
- `Invalid token signature` - Token signature verification failed
- `Clock moved backwards` - System time moved backwards
- `Worker ID exceeds maximum` - Invalid worker ID provided

## Best Practices

1. **Token Secrets**
   - Use a strong, random secret key
   - Store securely (e.g., environment variables)
   - Rotate secrets periodically
   - Never expose in client-side code

2. **Worker IDs**
   - Use consistent worker IDs per instance
   - Monitor for worker ID collisions
   - Consider using manual IDs in production

3. **Token Data**
   - Include expiration timestamps
   - Minimize token payload size
   - Validate data before generating tokens

4. **Error Handling**
   - Always handle HelixError cases
   - Implement proper logging
   - Monitor for clock drift issues

## Performance

- Can generate 4096 unique IDs per millisecond per worker
- Token generation and verification are CPU-bound operations
- ID generation is purely in-memory and very fast
- Worker ID generation is cached per instance

## Migration Guide

### From Previous Version

1. Token format changed from three parts to two:
   - Old: `<payload>.<entropy>.<signature>`
   - New: `<payload>.<signature>`

2. Constructor now takes an options object:
   ```typescript
   // Old
   const helix = new Helix(workerId);
   
   // New
   const helix = new Helix({ workerId, tokenSecret });
   ```

3. Token methods simplified:
   ```typescript
   // Old
   const token = helix.generateToken(data);
   const decoded = Helix.decodeToken(token);
   
   // New
   const token = helix.generateToken(data);
   const decoded = helix.verifyToken(token);
   ```
