# Date Utilities

The date utilities module provides a comprehensive set of functions for date manipulation, formatting, and validation.

## Overview

Date utilities features:
- Date formatting
- Time unit manipulation
- Date difference calculation
- Date validation
- Start/End of time units
- Timezone handling

## Basic Usage

### Date Formatting

```typescript
import { formatDate } from '@vtubers.tv/node-utils';

// Basic formatting
formatDate(new Date()); // "2024-03-14 15:30:45"

// Custom format
formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss.SSS A'); // "2024-03-14 15:30:45.123 PM"

// Format with timezone
formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss', {
  timezone: 'America/New_York'
}); // "2024-03-14 11:30:45"

// Format with locale
formatDate(new Date(), 'DDD day of the year', {
  locale: 'en-US'
}); // "074 day of the year"
```

### Time Unit Manipulation

```typescript
import { addTime } from '@vtubers.tv/node-utils';

// Add days
addTime(new Date(), 2, 'days'); // Add 2 days

// Subtract hours
addTime(new Date(), -1, 'hours'); // Subtract 1 hour

// Add with time preservation
addTime(new Date(), 1, 'days', { preserveTime: true }); // Add 1 day, keep time

// Add without time preservation
addTime(new Date(), 1, 'days', { preserveTime: false }); // Add 1 day, reset time
```

### Date Difference Calculation

```typescript
import { getTimeDifference } from '@vtubers.tv/node-utils';

// Difference in days
getTimeDifference(
  new Date('2024-03-14'),
  new Date('2024-03-16'),
  'days'
); // 2

// Absolute difference
getTimeDifference(
  new Date('2024-03-14'),
  new Date('2024-03-12'),
  'days',
  { absolute: true }
); // 2

// Precise difference
getTimeDifference(
  new Date('2024-03-14 12:00:00'),
  new Date('2024-03-14 12:30:00'),
  'minutes',
  { precise: true }
); // 30
```

## Advanced Features

### Date Validation

```typescript
import { isValidDate } from '@vtubers.tv/node-utils';

// Basic validation
isValidDate('2024-02-30'); // false
isValidDate('2024-02-29'); // true

// Validation with constraints
isValidDate('2024-03-14', {
  min: new Date('2024-01-01'),
  max: new Date('2024-12-31'),
  allowFuture: false
}); // true
```

### Start/End of Time Units

```typescript
import { getStartOf, getEndOf } from '@vtubers.tv/node-utils';

// Start of day
getStartOf(new Date(), 'day'); // 00:00:00.000

// End of day
getEndOf(new Date(), 'day'); // 23:59:59.999

// Start of hour
getStartOf(new Date(), 'hour'); // HH:00:00.000

// End of hour
getEndOf(new Date(), 'hour'); // HH:59:59.999

// With timezone preservation
getStartOf(new Date(), 'day', { preserveTimezone: true });
```

## Best Practices

1. **Date Formatting**
   - Use appropriate format strings
   - Consider timezone implications
   - Handle locale differences

2. **Time Unit Manipulation**
   - Choose appropriate time units
   - Consider time preservation
   - Handle edge cases

3. **Date Validation**
   - Validate input dates
   - Consider timezone issues
   - Handle invalid dates

4. **Date Differences**
   - Use appropriate precision
   - Consider timezone effects
   - Handle edge cases

## Performance Considerations

1. **Date Operations**
   - Cache formatted dates when possible
   - Use appropriate time units
   - Consider timezone conversions

2. **Validation**
   - Validate early
   - Handle invalid dates gracefully
   - Consider performance impact

3. **Timezone Handling**
   - Use appropriate timezone methods
   - Consider UTC conversions
   - Handle daylight saving time 