# API Utilities Usage Examples

This document provides examples of how to use the AdGenXAI API utilities in your Netlify functions.

## Table of Contents
- [Basic Function Structure](#basic-function-structure)
- [Response Utilities](#response-utilities)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Middleware](#middleware)
- [Complete Example](#complete-example)

## Basic Function Structure

A typical Netlify function using our utilities follows this pattern:

```typescript
import { Handler } from '@netlify/functions';
import {
  checkMethod,
  getRequestId,
  logRequest,
  createTimer,
  successResponse,
  errorResponse,
} from '../../lib/api';

export const handler: Handler = async (event, context) => {
  const requestId = getRequestId(event);
  const timer = createTimer();

  // Log the incoming request
  logRequest(event, requestId);

  // Check HTTP method
  const methodCheck = checkMethod(event, ['GET', 'POST']);
  if (methodCheck) return methodCheck;

  try {
    // Your business logic here
    const data = { message: 'Hello, World!' };

    return successResponse(data, 200, {
      requestId,
      responseTime: timer.elapsed(),
    });
  } catch (error: any) {
    return errorResponse(
      'Something went wrong',
      500,
      'INTERNAL_ERROR',
      { message: error.message }
    );
  }
};
```

## Response Utilities

### Success Response

```typescript
import { successResponse, HttpStatus } from '../../lib/api';

// Simple success response
return successResponse({ id: 123, name: 'Test' });

// With custom status code
return successResponse(
  { created: true },
  HttpStatus.CREATED
);

// With metadata
return successResponse(
  { data: 'result' },
  HttpStatus.OK,
  { requestId: 'abc123', responseTime: 45 }
);
```

### Error Responses

```typescript
import {
  errorResponse,
  validationErrorResponse,
  notFoundResponse,
  HttpStatus,
  ErrorCode,
} from '../../lib/api';

// Generic error
return errorResponse(
  'Operation failed',
  HttpStatus.INTERNAL_SERVER_ERROR,
  ErrorCode.INTERNAL_ERROR
);

// Validation error
return validationErrorResponse({
  errors: [
    { field: 'email', message: 'Invalid email format' }
  ]
});

// Not found
return notFoundResponse('User');

// With details
return errorResponse(
  'External API error',
  HttpStatus.BAD_GATEWAY,
  ErrorCode.EXTERNAL_API_ERROR,
  {
    apiEndpoint: 'https://api.example.com',
    statusCode: 502
  }
);
```

## Validation

### Using Zod Schemas

```typescript
import { validateBody, schemas } from '../../lib/api';

export const handler: Handler = async (event, context) => {
  // Validate using built-in schema
  const validation = validateBody(event.body, schemas.instagramPost);
  
  if (!validation.success) {
    return validation.response; // Returns formatted error
  }

  const { imageUrl, caption } = validation.data;
  // Data is now type-safe and validated
};
```

### Custom Zod Schema

```typescript
import { z } from 'zod';
import { validateBody } from '../../lib/api';

const customSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  age: z.number().min(18).max(120),
  preferences: z.object({
    newsletter: z.boolean(),
  }).optional(),
});

export const handler: Handler = async (event, context) => {
  const validation = validateBody(event.body, customSchema);
  
  if (!validation.success) {
    return validation.response;
  }

  const userData = validation.data;
  // userData is typed as z.infer<typeof customSchema>
};
```

### Input Sanitization

```typescript
import { sanitizeString, sanitizeObject } from '../../lib/api';

// Sanitize a string
const cleanedInput = sanitizeString(userInput);

// Sanitize an entire object
const cleanedData = sanitizeObject({
  name: '  John Doe  ',
  bio: 'Hello\0World',
  metadata: {
    tags: ['  tag1  ', '  tag2  ']
  }
});
// Result: { name: 'John Doe', bio: 'HelloWorld', metadata: { tags: ['tag1', 'tag2'] } }
```

## Error Handling

### Standard Error Codes

```typescript
import { ErrorCode, HttpStatus } from '../../lib/api';

// Authentication error
if (!apiKey) {
  return errorResponse(
    'API key required',
    HttpStatus.UNAUTHORIZED,
    ErrorCode.AUTHENTICATION_ERROR
  );
}

// Authorization error
if (!hasPermission) {
  return errorResponse(
    'Insufficient permissions',
    HttpStatus.FORBIDDEN,
    ErrorCode.AUTHORIZATION_ERROR
  );
}

// Rate limiting
if (isRateLimited) {
  return rateLimitResponse(60); // Retry after 60 seconds
}

// Service unavailable
if (!serviceAvailable) {
  return errorResponse(
    'Service temporarily unavailable',
    HttpStatus.SERVICE_UNAVAILABLE,
    ErrorCode.SERVICE_UNAVAILABLE
  );
}
```

## Middleware

### Request Logging

```typescript
import { logRequest, logResponse, createTimer } from '../../lib/api';

export const handler: Handler = async (event, context) => {
  const requestId = getRequestId(event);
  const timer = createTimer();

  // Log incoming request
  logRequest(event, requestId);

  // Your logic here
  const response = successResponse({ data: 'result' });

  // Log outgoing response
  logResponse(requestId, response.statusCode, timer.elapsed());

  return response;
};
```

### Environment Variables

```typescript
import { getRequiredEnv, getOptionalEnv } from '../../lib/api';

export const handler: Handler = async (event, context) => {
  try {
    // Will throw if missing
    const apiKey = getRequiredEnv('API_KEY');
    
    // Returns undefined if missing
    const optionalFeature = getOptionalEnv('FEATURE_FLAG', 'default_value');

    // Use the variables
  } catch (error) {
    return errorResponse(
      'Missing required configuration',
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.MISSING_CONFIGURATION
    );
  }
};
```

## Complete Example

Here's a complete example combining all the utilities:

```typescript
// netlify/functions/user-profile.ts
import { Handler } from '@netlify/functions';
import { z } from 'zod';
import {
  checkMethod,
  getRequestId,
  logRequest,
  createTimer,
  validateBody,
  successResponse,
  errorResponse,
  notFoundResponse,
  HttpStatus,
  ErrorCode,
} from '../../lib/api';

// Define validation schema
const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
});

export const handler: Handler = async (event, context) => {
  const requestId = getRequestId(event);
  const timer = createTimer();

  logRequest(event, requestId);

  // Only allow POST requests
  const methodCheck = checkMethod(event, ['POST']);
  if (methodCheck) return methodCheck;

  try {
    // Validate request body
    const validation = validateBody(event.body, updateProfileSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { userId, name, email, bio } = validation.data;

    // Simulate database lookup
    const userExists = await checkUserExists(userId);
    if (!userExists) {
      return notFoundResponse('User');
    }

    // Simulate updating user profile
    const updatedProfile = await updateUserProfile({
      userId,
      name,
      email,
      bio,
    });

    return successResponse(
      {
        profile: updatedProfile,
        message: 'Profile updated successfully',
      },
      HttpStatus.OK,
      {
        requestId,
        responseTime: timer.elapsed(),
      }
    );
  } catch (error: any) {
    console.error('Profile update error:', error);
    
    // Check for specific error types
    if (error.message.includes('database')) {
      return errorResponse(
        'Database error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        ErrorCode.INTERNAL_ERROR,
        { message: 'Unable to update profile at this time' }
      );
    }

    return errorResponse(
      'Failed to update profile',
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_ERROR,
      { message: error.message }
    );
  }
};

// Helper functions (simulated)
async function checkUserExists(userId: string): Promise<boolean> {
  // Database lookup logic
  return true;
}

async function updateUserProfile(data: any): Promise<any> {
  // Database update logic
  return data;
}
```

## Testing Your Function

### Using cURL

```bash
# Test with valid data
curl -X POST https://your-site.netlify.app/api/user-profile \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "Software developer"
  }'

# Test validation error
curl -X POST https://your-site.netlify.app/api/user-profile \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "invalid-uuid",
    "name": "John"
  }'

# Test method not allowed
curl -X GET https://your-site.netlify.app/api/user-profile
```

### Expected Responses

**Success:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "userId": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "john@example.com",
      "bio": "Software developer"
    },
    "message": "Profile updated successfully"
  },
  "meta": {
    "timestamp": "2024-11-02T00:00:00.000Z",
    "requestId": "req_1234567890_abc123",
    "responseTime": 125
  }
}
```

**Validation Error:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "message": "Invalid request body",
      "errors": [
        {
          "path": "userId",
          "message": "Invalid uuid",
          "code": "invalid_string"
        }
      ]
    },
    "timestamp": "2024-11-02T00:00:00.000Z"
  }
}
```

## Best Practices

1. **Always use type-safe validation** - Use Zod schemas for all request validation
2. **Log requests and responses** - Include requestId for tracking
3. **Use specific error codes** - Help clients understand what went wrong
4. **Include timing metrics** - Monitor performance
5. **Sanitize user input** - Prevent injection attacks
6. **Handle errors gracefully** - Provide helpful error messages
7. **Use consistent response format** - Makes client integration easier

## See Also

- [API Documentation](./README.md)
- [OpenAPI Specification](./openapi.yaml)
- [Postman Collection](./postman-collection.json)
