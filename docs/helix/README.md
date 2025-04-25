# Helix ID Generator

The Helix ID generator provides a robust solution for generating distributed unique IDs and secure tokens. It implements a Snowflake-like algorithm with additional features for token generation and validation.

## Overview

Helix features:
- Distributed unique ID generation
- Secure token creation with metadata
- Token validation and decoding
- Worker ID management
- Clock drift handling
- Sequence overflow protection

## ID Structure

Helix IDs are 64-bit integers with the following structure:
```
+------------------+------------------+------------------+
|      Timestamp   |    Worker ID    |    Sequence     |
|     (42 bits)    |    (10 bits)    |    (12 bits)    |
+------------------+------------------+------------------+
```

- **Timestamp**: 42 bits (milliseconds since custom epoch)
- **Worker ID**: 10 bits (supports up to 1024 instances)
- **Sequence**: 12 bits (up to 4096 IDs per millisecond)

## Basic Usage

### Generating IDs

```typescript
import { Helix } from '@vtubers.tv/node-utils';

// Create Helix instance
const helix = new Helix();

// Generate unique ID
const id = helix.generateId();
```

### Creating Tokens

```typescript
// Generate token with metadata
const token = helix.generateToken({
  userId: '123',
  role: 'admin'
});

// Generate token with metadata (extra data)
const token = helix.generateToken({
  userId: '123',
  role: 'admin',
  messageFromSelina: 'I love cottontailva!'
});

// Decode token
const decoded = Helix.decodeToken(token);
```

### Decoding IDs

```typescript
// Decode ID components
const components = Helix.decodeId(BigInt(id));
console.log(components.timestamp); // Date
console.log(components.workerId); // number
console.log(components.sequence); // number
```

## Advanced Features

### Worker ID Management

```typescript
// Create instance with specific worker ID
const helix = new Helix(42);

// Auto-generated worker ID based on environment
const helix = new Helix();
```

### Token Generation

```typescript
// Generate token with different data types
const token1 = helix.generateToken('string data');
const token2 = helix.generateToken(Buffer.from('binary data'));
const token3 = helix.generateToken({ complex: 'object' });
```

### Token Validation

```typescript
try {
  const decoded = Helix.decodeToken(token);
  // Token is valid
} catch (error) {
  if (error instanceof HelixError) {
    // Handle invalid token
  }
}
```

## Technical Details

### Epoch

Helix uses a custom epoch (2015-01-01T00:00:00.000Z) to maximize the available timestamp range:
```typescript
const EPOCH = 1420070400000; // 2015-01-01T00:00:00.000Z
```

### Bit Allocation

```typescript
const TIMESTAMP_BITS = 42;
const WORKER_ID_BITS = 10;
const SEQUENCE_BITS = 12;

const MAX_WORKER_ID = (1 << WORKER_ID_BITS) - 1;  // 1023
const MAX_SEQUENCE = (1 << SEQUENCE_BITS) - 1;    // 4095
```

### Token Format

Tokens follow the format:
```
[Base64URL(Version + Data)][Base64URL(Entropy)][Base64URL(HMAC Signature)]
```

## Error Handling

### Clock Drift

```typescript
try {
  const id = helix.generateId();
} catch (error) {
  if (error instanceof HelixError) {
    // Handle clock drift
  }
}
```

### Sequence Overflow

```typescript
// Helix automatically handles sequence overflow
// by waiting for the next millisecond
const id = helix.generateId();
```

## Security Features

### Token Security

1. **HMAC Signing**
   - All tokens are signed with HMAC-SHA256
   - Signature length: 8 bytes
   - Base64URL encoding for URL safety
   - Manual signature verification available via `verifyHMAC`

2. **Entropy**
   - 16 bytes of random entropy
   - Prevents token prediction
   - Ensures uniqueness

3. **Version Control**
   - Token versioning support
   - Future compatibility
   - Migration path

### HMAC Verification

```typescript
// Verify an HMAC signature
const payload = Buffer.from('data to verify');
const signature = 'base64url_encoded_signature';

// Using default secret
const isValid = Helix.verifyHMAC(payload, signature);

// Using custom secret
const isValid = Helix.verifyHMAC(payload, signature, 'custom_secret');

// String payload
const isValid = Helix.verifyHMAC('string data', signature);
```

The `verifyHMAC` function provides:
- Direct signature verification
- Support for Buffer and string payloads
- Optional custom secret key
- Safe error handling (returns false on invalid input)
- Constant-time comparison for security

## Best Practices

1. **ID Generation**
   - Use singleton pattern
   - Handle clock drift
   - Monitor sequence overflow

2. **Token Management**
   - Store tokens securely
   - Validate before use
   - Handle expiration

3. **Worker ID Management**
   - Use stable worker IDs
   - Monitor worker count
   - Handle worker failures

4. **Error Handling**
   - Implement proper error handling
   - Log security events
   - Monitor for issues

## Performance Considerations

1. **ID Generation**
   - High throughput (4096 IDs/ms)
   - No network calls
   - Minimal CPU usage

2. **Token Generation**
   - Efficient encoding
   - Fast validation
   - Minimal overhead

3. **Resource Usage**
   - Memory efficient
   - No external dependencies
   - Thread-safe
