# String Utilities

The string utilities module provides a comprehensive set of functions for string manipulation, formatting, and validation.

## Overview

String utilities features:
- Case conversion
- String truncation
- Whitespace handling
- String validation
- Word counting
- String reversal
- Unicode support

## Basic Usage

### Case Conversion

```typescript
import { capitalize, toCamelCase, toKebabCase, toPascalCase, toSnakeCase } from '@vtubers.tv/node-utils';

// Capitalize first letter
capitalize('hello world'); // "Hello world"

// Convert to camelCase
toCamelCase('hello-world'); // "helloWorld"

// Convert to kebab-case
toKebabCase('helloWorld'); // "hello-world"

// Convert to PascalCase
toPascalCase('hello-world'); // "HelloWorld"

// Convert to snake_case
toSnakeCase('helloWorld'); // "hello_world"
```

### String Truncation

```typescript
import { truncate } from '@vtubers.tv/node-utils';

// Basic truncation
truncate('Hello world', 8); // "Hello..."

// Custom ellipsis
truncate('Hello world', 8, { ellipsis: '...' }); // "Hello..."

// Preserve words
truncate('Hello world', 8, { preserveWords: true }); // "Hello"
```

### Whitespace Handling

```typescript
import { trim, removeWhitespace, normalizeWhitespace } from '@vtubers.tv/node-utils';

// Trim whitespace
trim('  hello world  '); // "hello world"

// Remove all whitespace
removeWhitespace('hello  world'); // "helloworld"

// Normalize whitespace
normalizeWhitespace('hello   world'); // "hello world"
```

## Advanced Features

### String Validation

```typescript
import { isEmpty, isAlphanumeric } from '@vtubers.tv/node-utils';

// Check if string is empty
isEmpty(''); // true
isEmpty('  '); // true
isEmpty('  ', { includeWhitespace: false }); // false

// Check if string is alphanumeric
isAlphanumeric('abc123'); // true
isAlphanumeric('abc 123', { includeSpaces: true }); // true
```

### Word Operations

```typescript
import { wordCount, reverse } from '@vtubers.tv/node-utils';

// Count words
wordCount('Hello world'); // 2
wordCount('Hello world', { minLength: 5 }); // 1

// Reverse string
reverse('hello'); // "olleh"
```

## Unicode Support

All string utilities support Unicode characters:

```typescript
// Unicode case conversion
capitalize('über'); // "Über"

// Unicode whitespace
trim('\u00A0hello\u00A0'); // "hello"

// Unicode word counting
wordCount('Hello 世界'); // 2
```

## Best Practices

1. **Case Conversion**
   - Use appropriate case conversion for your use case
   - Consider preserving acronyms when needed
   - Handle special characters appropriately

2. **String Truncation**
   - Set appropriate length limits
   - Consider word boundaries
   - Use meaningful ellipsis

3. **Whitespace Handling**
   - Use trim() for basic whitespace removal
   - Use removeWhitespace() for complete removal
   - Use normalizeWhitespace() for consistent spacing

4. **Validation**
   - Always validate input strings
   - Consider edge cases
   - Use appropriate validation options

## Performance Considerations

1. **String Operations**
   - Use appropriate methods for your needs
   - Consider memory usage for large strings
   - Cache results when possible

2. **Unicode Handling**
   - Be aware of Unicode character lengths
   - Consider normalization when needed
   - Handle surrogate pairs correctly

3. **Memory Usage**
   - Avoid unnecessary string copies
   - Use string methods efficiently
   - Consider string pooling for frequently used strings 