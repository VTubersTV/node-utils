# File Utilities

The file utilities module provides a comprehensive set of functions for file system operations, path manipulation, and file management.

## Overview

File utilities features:
- File existence checking
- Directory management
- File reading/writing
- Path manipulation
- File listing
- File deletion
- File extension handling

## Basic Usage

### File Existence Checking

```typescript
import { fileExists } from '@vtubers.tv/node-utils';

// Check if file exists
await fileExists('path/to/file.txt'); // true/false

// Check if directory exists
await fileExists('path/to/dir', 'directory'); // true/false

// Check if file exists
await fileExists('path/to/file.txt', 'file'); // true/false
```

### Directory Management

```typescript
import { ensureDir } from '@vtubers.tv/node-utils';

// Create directory
await ensureDir('path/to/dir'); // Creates directory and parents

// Create with options
await ensureDir('path/to/dir', {
  mode: 0o755,
  recursive: true
});
```

### File Reading/Writing

```typescript
import { readFile, writeFile } from '@vtubers.tv/node-utils';

// Read file
const content = await readFile('path/to/file.txt', {
  encoding: 'utf-8'
});

// Write file
await writeFile('path/to/file.txt', 'content', {
  encoding: 'utf-8',
  mode: 0o644
});
```

## Advanced Features

### Path Manipulation

```typescript
import { getFileExtension, getFileName } from '@vtubers.tv/node-utils';

// Get file extension
getFileExtension('path/to/file.txt'); // ".txt"
getFileExtension('path/to/file.txt', { withDot: false }); // "txt"
getFileExtension('path/to/file.txt', { lowercase: true }); // ".txt"

// Get file name
getFileName('path/to/file.txt'); // "file"
getFileName('path/to/file.txt', { withExt: true }); // "file.txt"
getFileName('path/to/file.txt', { lowercase: true }); // "file"
```

### File Listing

```typescript
import { listFiles } from '@vtubers.tv/node-utils';

// List all files
const files = await listFiles('path/to/dir', {
  recursive: true
});

// List with filtering
const files = await listFiles('path/to/dir', {
  recursive: true,
  filter: stats => stats.size > 1000,
  maxDepth: 2
});
```

### File Deletion

```typescript
import { deleteFile } from '@vtubers.tv/node-utils';

// Delete file
await deleteFile('path/to/file.txt');

// Delete directory recursively
await deleteFile('path/to/dir', {
  recursive: true
});

// Force delete
await deleteFile('path/to/file.txt', {
  force: true
});
```

## Best Practices

1. **File Operations**
   - Use async/await
   - Handle errors appropriately
   - Check file existence before operations

2. **Directory Management**
   - Use recursive option when needed
   - Set appropriate permissions
   - Handle parent directories

3. **Path Handling**
   - Use appropriate path separators
   - Handle special characters
   - Consider platform differences

4. **File Listing**
   - Use appropriate filters
   - Consider depth limits
   - Handle large directories

## Performance Considerations

1. **File Operations**
   - Use streams for large files
   - Cache file contents when appropriate
   - Handle concurrent operations

2. **Directory Operations**
   - Use recursive option carefully
   - Consider memory usage
   - Handle deep directories

3. **File Listing**
   - Use appropriate filters
   - Consider pagination
   - Handle large directories

## Error Handling

1. **File Operations**
   - Handle file not found
   - Handle permission errors
   - Handle concurrent access

2. **Directory Operations**
   - Handle directory not found
   - Handle permission errors
   - Handle recursive errors

3. **Path Operations**
   - Handle invalid paths
   - Handle special characters
   - Handle platform differences 