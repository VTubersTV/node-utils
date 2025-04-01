# Object Utilities

The object utilities module provides a comprehensive set of functions for object manipulation, cloning, and validation.

## Overview

Object utilities features:
- Deep object cloning
- Object validation
- Property picking/omitting
- Object merging
- Path-based access
- Object emptiness checking

## Basic Usage

### Object Cloning

```typescript
import { deepClone } from '@vtubers.tv/node-utils';

// Basic cloning
const obj = { a: 1, b: { c: 2 } };
deepClone(obj); // { a: 1, b: { c: 2 } }

// Clone with circular reference handling
const circular = { a: 1 };
circular.self = circular;
deepClone(circular, { handleCircular: true }); // { a: 1, self: [Circular] }

// Clone with prototype preservation
class MyClass {}
const instance = new MyClass();
deepClone(instance, { preservePrototype: true }); // instanceof MyClass
```

### Object Validation

```typescript
import { isEmpty } from '@vtubers.tv/node-utils';

// Basic empty check
isEmpty({}); // true

// Check with nullish values
isEmpty({ a: null, b: undefined }, { ignoreNullish: true }); // true

// Check with whitespace strings
isEmpty({ a: '  ' }, { ignoreWhitespace: true }); // true

// Custom validation
isEmpty(
  { a: 0 },
  { customValidator: value => value === 0 }
); // true
```

### Property Selection

```typescript
import { pick, omit } from '@vtubers.tv/node-utils';

// Pick properties
const obj = { a: 1, b: 2, c: 3 };
pick(obj, ['a', 'b']); // { a: 1, b: 2 }

// Pick with filtering
pick(obj, ['a', 'b'], {
  filter: value => value > 1
}); // { b: 2 }

// Omit properties
omit(obj, ['a']); // { b: 2, c: 3 }

// Omit with deep removal
omit(obj, ['a'], { deep: true }); // { b: 2, c: 3 }
```

## Advanced Features

### Object Merging

```typescript
import { merge } from '@vtubers.tv/node-utils';

// Basic merging
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 } };
merge(obj1, obj2); // { a: 1, b: { c: 2, d: 3 } }

// Merge with array strategy
const arr1 = [1, 2];
const arr2 = [2, 3];
merge(
  { arr: arr1 },
  { arr: arr2 },
  { arrayStrategy: 'unique' }
); // { arr: [1, 2, 3] }

// Custom merge function
merge(
  { a: 1 },
  { a: 2 },
  {
    customMerge: (target, source, key) => 
      key === 'a' ? target + source : source
  }
); // { a: 3 }
```

### Path-based Access

```typescript
import { get, set } from '@vtubers.tv/node-utils';

// Get value by path
const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c'); // 1

// Get with default value
get(obj, 'x.y.z', { defaultValue: 0 }); // 0

// Get with validation
get(obj, 'a.b.c', {
  validate: value => typeof value === 'number'
}); // 1

// Set value by path
set(obj, 'a.b.d', 2); // { a: { b: { c: 1, d: 2 } } }
```

## Best Practices

1. **Object Cloning**
   - Handle circular references appropriately
   - Consider prototype preservation
   - Use custom replacers when needed

2. **Property Selection**
   - Use appropriate selection method
   - Consider deep vs. shallow operations
   - Handle undefined properties

3. **Object Merging**
   - Choose appropriate merge strategy
   - Handle arrays carefully
   - Consider custom merge functions

4. **Path-based Access**
   - Use appropriate path separators
   - Handle undefined paths
   - Consider validation needs

## Performance Considerations

1. **Deep Operations**
   - Consider depth of objects
   - Handle circular references
   - Use appropriate cloning strategy

2. **Property Access**
   - Cache path results when possible
   - Use appropriate access methods
   - Handle undefined properties

3. **Object Merging**
   - Consider merge complexity
   - Handle large objects
   - Use appropriate strategies 