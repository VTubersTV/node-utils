# Number Utilities

The number utilities module provides a comprehensive set of functions for number manipulation, validation, and formatting.

## Overview

Number utilities features:
- Number clamping
- Rounding operations
- Range validation
- Random number generation
- Number formatting
- Number validation
- Parity checking

## Basic Usage

### Number Clamping

```typescript
import { clamp } from '@vtubers.tv/node-utils';

// Basic clamping
clamp(5, 0, 10); // 5
clamp(15, 0, 10); // 10
clamp(-5, 0, 10); // 0

// Clamping with rounding
clamp(5.7, 0, 10, { round: 1 }); // 5.7
clamp(5.7, 0, 10, { round: 0 }); // 6
```

### Rounding Operations

```typescript
import { round } from '@vtubers.tv/node-utils';

// Basic rounding
round(3.14159); // 3

// Round with decimals
round(3.14159, { decimals: 2 }); // 3.14

// Different rounding modes
round(3.14159, { decimals: 1, mode: 'floor' }); // 3.1
round(3.14159, { decimals: 1, mode: 'ceil' }); // 3.2
round(3.14159, { decimals: 1, mode: 'trunc' }); // 3.1
```

### Range Validation

```typescript
import { isInRange } from '@vtubers.tv/node-utils';

// Inclusive range check
isInRange(5, 0, 10); // true
isInRange(0, 0, 10); // true
isInRange(10, 0, 10); // true

// Exclusive range check
isInRange(5, 0, 10, { inclusive: false }); // true
isInRange(0, 0, 10, { inclusive: false }); // false
isInRange(10, 0, 10, { inclusive: false }); // false
```

## Advanced Features

### Random Number Generation

```typescript
import { random } from '@vtubers.tv/node-utils';

// Basic random number
random(0, 10); // Random integer between 0 and 10

// Random number with decimals
random(0, 1, { decimals: 2 }); // Random float between 0 and 1 with 2 decimal places

// Seeded random number
random(0, 10, { seed: 42 }); // Deterministic random number

// Normal distribution
random(0, 10, { distribution: 'normal' }); // Random number with normal distribution
```

### Number Formatting

```typescript
import { formatNumber } from '@vtubers.tv/node-utils';

// Basic formatting
formatNumber(1234567.89); // "1,234,567.89"

// Custom formatting
formatNumber(1234567.89, {
  decimals: 1,
  prefix: '$',
  suffix: ' USD',
  locale: 'en-US'
}); // "$1,234,567.9 USD"
```

### Number Validation

```typescript
import { isValidNumber } from '@vtubers.tv/node-utils';

// Basic validation
isValidNumber(42); // true
isValidNumber('42', { allowString: true }); // true

// Advanced validation
isValidNumber(42, {
  min: 0,
  max: 100,
  allowInfinity: false,
  allowNaN: false
}); // true
```

### Parity Checking

```typescript
import { isEven, isOdd } from '@vtubers.tv/node-utils';

// Basic parity check
isEven(2); // true
isOdd(3); // true

// Parity check with tolerance
isEven(2.0000001, { tolerance: 0.000001 }); // true
isOdd(3.0000001, { tolerance: 0.000001 }); // true
```

## Best Practices

1. **Number Clamping**
   - Set appropriate min/max values
   - Consider rounding when needed
   - Handle edge cases

2. **Rounding Operations**
   - Choose appropriate rounding mode
   - Set correct decimal places
   - Consider floating-point precision

3. **Range Validation**
   - Use inclusive/exclusive ranges appropriately
   - Validate input ranges
   - Handle edge cases

4. **Random Number Generation**
   - Use appropriate distribution
   - Consider seeding for reproducibility
   - Handle edge cases

## Performance Considerations

1. **Number Operations**
   - Use appropriate precision
   - Consider memory usage
   - Cache results when possible

2. **Random Number Generation**
   - Use appropriate distribution
   - Consider performance impact
   - Handle edge cases

3. **Formatting**
   - Use appropriate locale
   - Consider performance for large numbers
   - Cache formatted results when possible 