# HTTP Client

The HTTP client provides a powerful and convenient way to make HTTP requests with built-in error handling, request/response interceptors, and automatic retries.

## Overview

The HTTP client features:
- Singleton pattern for consistent configuration
- Type-safe request/response handling
- Automatic error handling
- Request/response interceptors
- Retry mechanism
- Request cancellation
- Progress tracking

## Basic Usage

### Making Requests

```typescript
import { http } from '@vtubers.tv/node-utils';

// GET request
const data = await http.get('/users');

// POST request with data
const response = await http.post('/users', {
  name: 'John',
  email: 'john@example.com'
});

// PUT request
const updated = await http.put('/users/123', {
  name: 'John Updated'
});

// DELETE request
await http.delete('/users/123');

// PATCH request
const patched = await http.patch('/users/123', {
  name: 'John Patched'
});
```

### Configuration

```typescript
// Configure global settings
http.configure({
  baseURL: 'https://api.vtubers.tv',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds
});
```

### Type-Safe Requests

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Type-safe GET request
const user = await http.get<User>('/users/123');

// Type-safe POST request
const newUser = await http.post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
});
```

## Advanced Features

### Request Interceptors

```typescript
// Add request interceptor
http.interceptors.request.use(
  (config) => {
    // Modify request config
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);
```

### Response Interceptors

```typescript
// Add response interceptor
http.interceptors.response.use(
  (response) => {
    // Modify response data
    return response;
  },
  (error) => {
    // Handle response error
    if (error.response?.status === 401) {
      // Handle unauthorized
    }
    return Promise.reject(error);
  }
);
```

### Request Cancellation

```typescript
// Create cancel token
const controller = new AbortController();

// Make request with cancel token
const request = http.get('/users', {
  signal: controller.signal
});

// Cancel request
controller.abort();
```

### Progress Tracking

```typescript
// Track upload progress
const response = await http.post('/upload', formData, {
  onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log(`Upload progress: ${percentCompleted}%`);
  }
});

// Track download progress
const response = await http.get('/download', {
  onDownloadProgress: (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    console.log(`Download progress: ${percentCompleted}%`);
  }
});
```

## Error Handling

### Built-in Error Handling

```typescript
try {
  const response = await http.get('/users');
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Response error:', error.response.status);
    console.error('Error data:', error.response.data);
  } else if (error.request) {
    // Request made but no response
    console.error('Request error:', error.request);
  } else {
    // Error in request setup
    console.error('Error:', error.message);
  }
}
```

### Custom Error Handling

```typescript
// Create custom error handler
const errorHandler = (error) => {
  if (error.response?.status === 429) {
    // Handle rate limiting
  }
  return Promise.reject(error);
};

// Add to interceptors
http.interceptors.response.use(null, errorHandler);
```

## Request Configuration

### Query Parameters

```typescript
// Add query parameters
const response = await http.get('/users', {
  params: {
    page: 1,
    limit: 10,
    sort: 'name'
  }
});
```

### Headers

```typescript
// Add custom headers
const response = await http.get('/users', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Custom-Header': 'value'
  }
});
```

### Timeout

```typescript
// Set request timeout
const response = await http.get('/users', {
  timeout: 5000 // 5 seconds
});
```

## Response Handling

### Response Types

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Type-safe response
const response: ApiResponse<User> = await http.get('/users/123');
```

### Response Validation

```typescript
// Validate response data
const validateResponse = (data: unknown): User => {
  if (!isUser(data)) {
    throw new Error('Invalid response data');
  }
  return data;
};

const user = await http.get('/users/123').then(response => 
  validateResponse(response.data)
);
```

## Best Practices

1. **Error Handling**
   - Always use try/catch blocks
   - Implement proper error logging
   - Handle specific error cases

2. **Request Configuration**
   - Set appropriate timeouts
   - Use proper headers
   - Implement retry logic

3. **Response Handling**
   - Validate response data
   - Handle edge cases
   - Implement proper typing

4. **Security**
   - Use HTTPS
   - Implement proper authentication
   - Handle sensitive data