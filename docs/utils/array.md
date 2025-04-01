# Array Utilities

The array utilities module provides a comprehensive set of functions for array manipulation, transformation, and validation.

## Overview

Array utilities features:
- Array deduplication
- Array shuffling
- Array grouping
- Array chunking
- Array flattening
- Array validation
- Array range generation

## Basic Usage

### Array Deduplication

```typescript
import { unique } from '@vtubers.tv/node-utils';

// Basic deduplication
unique([1, 2, 2, 3]); // [1, 2, 3]

// Custom comparison
unique(
  [{id: 1}, {id: 1}],
  (a, b) => a.id === b.id
); // [{id: 1}]

// Preserve order
unique([3, 1, 2, 1], undefined, { preserveOrder: true }); // [3, 1, 2]
```

### Array Shuffling

```typescript
import { shuffle } from '@vtubers.tv/node-utils';

// Basic shuffling
shuffle([1, 2, 3, 4, 5]); // Randomly shuffled array

// Seeded shuffling
shuffle([1, 2, 3, 4, 5], { seed: 42 }); // Deterministic shuffle

// In-place shuffling
const arr = [1, 2, 3, 4, 5];
shuffle(arr, { inPlace: true }); // arr is shuffled
```

### Array Grouping

```typescript
import { groupBy } from '@vtubers.tv/node-utils';

// Basic grouping
groupBy(
  [{type: 'A'}, {type: 'B'}, {type: 'A'}],
  item => item.type
); // Map { 'A' => [{type: 'A'}, {type: 'A'}], 'B' => [{type: 'B'}] }

// Group with transformation
groupBy(
  [{type: 'A', value: 1}, {type: 'A', value: 2}],
  item => item.type,
  { transform: group => group.map(item => item.value) }
); // Map { 'A' => [1, 2] }

// Group with sorted keys
groupBy(
  [{type: 'B'}, {type: 'A'}],
  item => item.type,
  { sortKeys: true }
); // Map { 'A' => [{type: 'A'}], 'B' => [{type: 'B'}] }
```

## Advanced Features

### Array Chunking

```typescript
import { chunk } from '@vtubers.tv/node-utils';

// Basic chunking
chunk([1, 2, 3, 4], 2); // [[1, 2], [3, 4]]

// Chunk with overlap
chunk([1, 2, 3, 4], 2, { overlap: 1 }); // [[1, 2], [2, 3], [3, 4]]

// Chunk with padding
chunk([1, 2, 3], 2, { pad: 0 }); // [[1, 2], [3, 0]]
```

### Array Flattening

```typescript
import { flatten } from '@vtubers.tv/node-utils';

// Basic flattening
flatten([1, [2, [3]]]); // [1, 2, 3]

// Flatten with depth control
flatten([1, [2, [3]]], { depth: 1 }); // [1, 2, [3]]

// Flatten with transformation
flatten(
  [1, [2, [3]]],
  { transform: n => n * 2 }
); // [2, 4, 6]
```

### Array Validation

```typescript
import { isEmpty } from '@vtubers.tv/node-utils';

// Basic empty check
isEmpty([]); // true

// Check with null values
isEmpty([null, null], { checkNull: true }); // true

// Check with undefined values
isEmpty([undefined, undefined], { checkUndefined: true }); // true

// Check with empty strings
isEmpty(['', ''], { checkEmptyStrings: true }); // true
```

### Array Range Generation

```typescript
import { range } from '@vtubers.tv/node-utils';

// Basic range
range(1, 5); // [1, 2, 3, 4, 5]

// Range with step
range(1, 5, { step: 2 }); // [1, 3, 5]

// Range with transformation
range(1, 3, { transform: n => n * 2 }); // [2, 4, 6]

// Non-inclusive range
range(1, 5, { inclusive: false }); // [1, 2, 3, 4]
```

## Best Practices

1. **Array Deduplication**
   - Use appropriate comparison function
   - Consider order preservation
   - Handle complex objects carefully

2. **Array Shuffling**
   - Use seeding for reproducibility
   - Consider in-place vs. new array
   - Handle edge cases

3. **Array Grouping**
   - Use appropriate key functions
   - Consider transformation needs
   - Handle empty groups

4. **Array Chunking**
   - Set appropriate chunk size
   - Consider overlap needs
   - Handle padding appropriately

## Performance Considerations

1. **Array Operations**
   - Use appropriate methods for your needs
   - Consider memory usage
   - Cache results when possible

2. **Large Arrays**
   - Consider chunking for processing
   - Use appropriate data structures
   - Handle memory constraints

3. **Complex Operations**
   - Use appropriate algorithms
   - Consider time complexity
   - Handle edge cases efficiently 