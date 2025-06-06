/**
 * HTTP Status Codes Enum
 * A comprehensive collection of HTTP status codes with their corresponding messages
 * These status codes are used to indicate the result of a client's request to the server
 */
export enum HttpStatus {
  // 1xx Informational
  /** 
   * The server has received the request headers and the client should proceed to send the request body.
   * This is typically used in large POST requests where the server wants to confirm it can handle the request
   * before the client sends the entire body. The client should continue sending the request body.
   * @example
   * Client: POST /upload HTTP/1.1
   * Server: HTTP/1.1 100 Continue
   */
  CONTINUE = 100,
  /** 
   * The server is switching protocols as requested by the client.
   * This is used when the server agrees to change the protocol being used on the connection.
   * Common use case: Upgrading from HTTP/1.1 to WebSocket.
   * @example
   * Client: GET /chat HTTP/1.1
   *         Upgrade: websocket
   * Server: HTTP/1.1 101 Switching Protocols
   *         Upgrade: websocket
   */
  SWITCHING_PROTOCOLS = 101,
  /** 
   * The server has received and is processing the request, but no response is available yet.
   * This prevents the client from timing out and assuming the request was lost.
   * Used in long-running operations like batch processing or complex calculations.
   * @example
   * Client: POST /batch-process HTTP/1.1
   * Server: HTTP/1.1 102 Processing
   */
  PROCESSING = 102,
  /** 
   * Used to return some response headers before final HTTP message.
   * Allows the server to send preliminary information to the client before the final response.
   * Useful for performance optimization and resource hints.
   * @example
   * Server: HTTP/1.1 103 Early Hints
   *         Link: </styles.css>; rel=preload; as=style
   */
  EARLY_HINTS = 103,

  // 2xx Success
  /** 
   * The request has succeeded.
   * This is the standard response for successful HTTP requests.
   * The actual response will depend on the request method used:
   * - GET: The resource has been fetched and is transmitted in the message body
   * - HEAD: The entity headers are in the message body
   * - POST: The resource describing the result of the action is transmitted in the message body
   * - TRACE: The message body contains the request message as received by the server
   */
  OK = 200,
  /** 
   * The request has succeeded and a new resource has been created as a result.
   * This is typically the response sent after a POST request, or after some PUT requests.
   * The new resource is effectively created before this response is sent.
   * @example
   * POST /users
   * {
   *   "name": "John Doe",
   *   "email": "john@example.com"
   * }
   * Response: 201 Created
   * Location: /users/123
   */
  CREATED = 201,
  /** 
   * The request has been accepted for processing, but the processing has not been completed.
   * The request might or might not be eventually acted upon, as it might be disallowed when processing actually takes place.
   * Useful for asynchronous processing of requests.
   * @example
   * POST /email/send
   * Response: 202 Accepted
   * {
   *   "message": "Email queued for delivery",
   *   "estimatedTime": "2 minutes"
   * }
   */
  ACCEPTED = 202,
  /** 
   * The returned metadata is different from what was originally available.
   * This is used when the server has transformed the resource in some way.
   * Common in proxy responses where the proxy has modified the original response.
   */
  NON_AUTHORITATIVE_INFORMATION = 203,
  /** 
   * The server successfully processed the request and is not returning any content.
   * This is often used for actions that don't require a response body, like DELETE operations.
   * The client should not change its document view.
   * @example
   * DELETE /users/123
   * Response: 204 No Content
   */
  NO_CONTENT = 204,
  /** 
   * The server successfully processed the request, but is not returning any content.
   * Unlike 204, this response requires the client to reset the document view.
   * Useful after form submissions to prevent resubmission.
   */
  RESET_CONTENT = 205,
  /** 
   * The server is delivering only part of the resource due to a range header sent by the client.
   * Used for resumable downloads and streaming media.
   * @example
   * GET /video.mp4
   * Range: bytes=0-1023
   * Response: 206 Partial Content
   * Content-Range: bytes 0-1023/2048
   */
  PARTIAL_CONTENT = 206,
  /** 
   * The message body that follows is an XML message and can contain a number of separate response codes.
   * Used in WebDAV to provide multiple status codes for different operations.
   * @example
   * <multistatus>
   *   <response>
   *     <href>/file1.txt</href>
   *     <status>HTTP/1.1 200 OK</status>
   *   </response>
   *   <response>
   *     <href>/file2.txt</href>
   *     <status>HTTP/1.1 404 Not Found</status>
   *   </response>
   * </multistatus>
   */
  MULTI_STATUS = 207,
  /** 
   * The members of a DAV binding have already been enumerated in a previous reply.
   * Used in WebDAV to avoid sending the same members multiple times.
   */
  ALREADY_REPORTED = 208,
  /** 
   * The server has fulfilled a request for the resource, and the response is a representation of the result
   * of one or more instance-manipulations applied to the current instance.
   * Used in delta encoding to indicate that the response contains differences from the previous version.
   */
  IM_USED = 226,

  // 3xx Redirection
  /** 
   * The request has more than one possible response.
   * The user agent or user should choose one of them.
   * Often used when the server can't determine which resource the client wants.
   * @example
   * GET /search?q=apple
   * Response: 300 Multiple Choices
   * {
   *   "options": [
   *     "/fruits/apple",
   *     "/company/apple",
   *     "/products/apple"
   *   ]
   * }
   */
  MULTIPLE_CHOICES = 300,
  /** 
   * The URL of the requested resource has been changed permanently.
   * The new URL is given in the response.
   * All future requests should use the new URL.
   * Search engines should update their links to the resource.
   * @example
   * GET /old-page
   * Response: 301 Moved Permanently
   * Location: /new-page
   */
  MOVED_PERMANENTLY = 301,
  /** 
   * The URL of the requested resource has been changed temporarily.
   * The new URL is given in the response.
   * Future requests should still use the original URL.
   * @example
   * GET /summer-sale
   * Response: 302 Found
   * Location: /current-promotions
   */
  FOUND = 302,
  /** 
   * The response to the request can be found under another URI using the GET method.
   * This is used to redirect the client to a different resource that can be accessed via GET.
   * @example
   * POST /form
   * Response: 303 See Other
   * Location: /success-page
   */
  SEE_OTHER = 303,
  /** 
   * Indicates that the resource has not been modified since the version specified by the request headers.
   * Used to save bandwidth by not sending the resource again.
   * @example
   * GET /resource
   * If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT
   * Response: 304 Not Modified
   */
  NOT_MODIFIED = 304,
  /** 
   * The requested resource is available only through a proxy.
   * The proxy's address is provided in the response.
   * @example
   * GET /resource
   * Response: 305 Use Proxy
   * Location: http://proxy.example.com
   */
  USE_PROXY = 305,
  /** 
   * The request should be repeated with another URI.
   * Unlike 302, the client should use the same HTTP method for the new request.
   * @example
   * POST /old-endpoint
   * Response: 307 Temporary Redirect
   * Location: /new-endpoint
   */
  TEMPORARY_REDIRECT = 307,
  /** 
   * The request and all future requests should be repeated using another URI.
   * Similar to 301, but the client must use the same HTTP method.
   * @example
   * POST /old-api
   * Response: 308 Permanent Redirect
   * Location: /new-api
   */
  PERMANENT_REDIRECT = 308,

  // 4xx Client Errors
  /** 
   * The server cannot or will not process the request due to an apparent client error.
   * This is a generic error message when no more specific error is suitable.
   * Common causes:
   * - Malformed request syntax
   * - Invalid request message framing
   * - Deceptive request routing
   * @example
   * POST /api/users
   * {
   *   "name": "John", // Missing required email field
   * }
   * Response: 400 Bad Request
   * {
   *   "error": "Missing required field: email"
   * }
   */
  BAD_REQUEST = 400,
  /** 
   * Authentication is required and has failed or has not been provided.
   * The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource.
   * @example
   * GET /protected-resource
   * Response: 401 Unauthorized
   * WWW-Authenticate: Bearer realm="example"
   */
  UNAUTHORIZED = 401,
  /** 
   * Reserved for future use. The original intention was that this code might be used as part of some form of digital cash or micropayment scheme.
   * Currently not widely used, but some APIs use it to indicate that payment is required for access.
   */
  PAYMENT_REQUIRED = 402,
  /** 
   * The server understood the request but refuses to authorize it.
   * Unlike 401, authentication will not help and the request SHOULD NOT be repeated.
   * Common use cases:
   * - IP-based access control
   * - Permission-based access control
   * - Content filtering
   * @example
   * GET /admin/users
   * Response: 403 Forbidden
   * {
   *   "error": "Insufficient permissions to access this resource"
   * }
   */
  FORBIDDEN = 403,
  /** 
   * The requested resource could not be found but may be available in the future.
   * This is the most common error code, indicating that the server cannot find the requested resource.
   * @example
   * GET /non-existent-page
   * Response: 404 Not Found
   */
  NOT_FOUND = 404,
  /** 
   * A request method is not supported for the requested resource.
   * The response must include an Allow header containing a list of valid methods for the requested resource.
   * @example
   * PUT /read-only-resource
   * Response: 405 Method Not Allowed
   * Allow: GET, HEAD
   */
  METHOD_NOT_ALLOWED = 405,
  /** 
   * The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request.
   * Used when the server cannot provide content in any of the formats requested by the client.
   * @example
   * GET /resource
   * Accept: application/xml
   * Response: 406 Not Acceptable
   * {
   *   "error": "Only JSON and YAML formats are supported"
   * }
   */
  NOT_ACCEPTABLE = 406,
  /** 
   * The client must first authenticate itself with the proxy.
   * Similar to 401, but authentication is required with the proxy.
   * @example
   * GET /resource
   * Response: 407 Proxy Authentication Required
   * Proxy-Authenticate: Basic realm="proxy"
   */
  PROXY_AUTHENTICATION_REQUIRED = 407,
  /** 
   * The server timed out waiting for the request.
   * The client can repeat the request without modifications at any later time.
   * @example
   * GET /slow-resource
   * Response: 408 Request Timeout
   */
  REQUEST_TIMEOUT = 408,
  /** 
   * Indicates that the request could not be processed because of conflict in the current state of the resource.
   * Common in concurrent modification scenarios.
   * @example
   * PUT /document
   * If-Match: "etag123"
   * Response: 409 Conflict
   * {
   *   "error": "Document has been modified by another user"
   * }
   */
  CONFLICT = 409,
  /** 
   * Indicates that the resource requested is no longer available and will not be available again.
   * This should be used when a resource has been permanently removed.
   * @example
   * GET /deleted-content
   * Response: 410 Gone
   * {
   *   "message": "This content has been permanently removed"
   * }
   */
  GONE = 410,
  /** 
   * The request did not specify the length of its content, which is required by the requested resource.
   * @example
   * POST /upload
   * Response: 411 Length Required
   * {
   *   "error": "Content-Length header is required"
   * }
   */
  LENGTH_REQUIRED = 411,
  /** 
   * The server does not meet one of the preconditions that the requester put on the request.
   * Common with conditional requests using If-Match, If-None-Match, or If-Modified-Since headers.
   * @example
   * PUT /resource
   * If-Match: "etag123"
   * Response: 412 Precondition Failed
   */
  PRECONDITION_FAILED = 412,
  /** 
   * The request is larger than the server is willing or able to process.
   * The server may close the connection to prevent the client from continuing the request.
   * @example
   * POST /upload
   * Content-Length: 1000000000
   * Response: 413 Payload Too Large
   * {
   *   "error": "Maximum file size is 10MB"
   * }
   */
  PAYLOAD_TOO_LARGE = 413,
  /** 
   * The URI provided was too long for the server to process.
   * This can occur when a client converts a POST request to a GET request with a long query string.
   * @example
   * GET /search?q=very+long+query+string...
   * Response: 414 URI Too Long
   */
  URI_TOO_LONG = 414,
  /** 
   * The request entity has a media type which the server or resource does not support.
   * @example
   * POST /upload
   * Content-Type: application/unsupported
   * Response: 415 Unsupported Media Type
   * {
   *   "error": "Only image/jpeg and image/png are supported"
   * }
   */
  UNSUPPORTED_MEDIA_TYPE = 415,
  /** 
   * The client has asked for a portion of the file, but the server cannot supply that portion.
   * Used when the Range header is invalid or cannot be satisfied.
   * @example
   * GET /video
   * Range: bytes=1000-2000
   * Response: 416 Range Not Satisfiable
   * Content-Range: bytes 1000
   */
  RANGE_NOT_SATISFIABLE = 416,
  /** 
   * The server cannot meet the requirements of the Expect request-header field.
   * @example
   * POST /upload
   * Expect: 100-continue
   * Response: 417 Expectation Failed
   */
  EXPECTATION_FAILED = 417,
  /** 
   * This code was defined in 1998 as one of the traditional IETF April Fools' jokes.
   * Some implementations use it to indicate that the server refuses to brew coffee because it is a teapot.
   * Not meant to be taken seriously, but sometimes used for humorous 404 responses.
   */
  IM_A_TEAPOT = 418,
  /** 
   * The request was directed at a server that is not able to produce a response.
   * This can happen when a server is not configured to produce responses for the combination of scheme and authority that are included in the request URI.
   * @example
   * GET https://example.com
   * Host: wrong-domain.com
   * Response: 421 Misdirected Request
   */
  MISDIRECTED_REQUEST = 421,
  /** 
   * The request was well-formed but was unable to be followed due to semantic errors.
   * Common in validation errors for API requests.
   * @example
   * POST /users
   * {
   *   "email": "invalid-email",
   *   "age": "not-a-number"
   * }
   * Response: 422 Unprocessable Entity
   * {
   *   "errors": [
   *     { "field": "email", "message": "Invalid email format" },
   *     { "field": "age", "message": "Must be a number" }
   *   ]
   * }
   */
  UNPROCESSABLE_ENTITY = 422,
  /** 
   * The resource that is being accessed is locked.
   * Used in WebDAV when a resource is locked by another client.
   * @example
   * PUT /document
   * Response: 423 Locked
   * {
   *   "error": "Document is locked by user123"
   * }
   */
  LOCKED = 423,
  /** 
   * The request failed because it depended on another request and that request failed.
   * Used in WebDAV when a request depends on the success of another request.
   * @example
   * POST /batch
   * Response: 424 Failed Dependency
   * {
   *   "error": "Operation failed because a dependent operation failed"
   * }
   */
  FAILED_DEPENDENCY = 424,
  /** 
   * Indicates that the server is unwilling to risk processing a request that might be replayed.
   * Used to prevent replay attacks.
   * @example
   * POST /payment
   * Response: 425 Too Early
   * {
   *   "error": "Request might be replayed"
   * }
   */
  TOO_EARLY = 425,
  /** 
   * The client should switch to a different protocol.
   * The server must include an Upgrade header in the response.
   * @example
   * GET /resource
   * Response: 426 Upgrade Required
   * Upgrade: HTTP/2.0
   */
  UPGRADE_REQUIRED = 426,
  /** 
   * The origin server requires the request to be conditional.
   * Used to prevent the "lost update" problem.
   * @example
   * PUT /resource
   * Response: 428 Precondition Required
   * {
   *   "error": "If-Match or If-None-Match header is required"
   * }
   */
  PRECONDITION_REQUIRED = 428,
  /** 
   * The user has sent too many requests in a given amount of time.
   * Used for rate limiting.
   * @example
   * GET /api/resource
   * Response: 429 Too Many Requests
   * Retry-After: 60
   * {
   *   "error": "Rate limit exceeded. Try again in 60 seconds"
   * }
   */
  TOO_MANY_REQUESTS = 429,
  /** 
   * The server is unwilling to process the request because either an individual header field, or all the header fields collectively, are too large.
   * @example
   * GET /resource
   * X-Custom-Header: very-long-header-value...
   * Response: 431 Request Header Fields Too Large
   */
  REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
  /** 
   * A server operator has received a legal demand to deny access to a resource or to a set of resources.
   * Used when access is denied for legal reasons, such as censorship or government-mandated blocking.
   * @example
   * GET /blocked-content
   * Response: 451 Unavailable For Legal Reasons
   * {
   *   "error": "Access denied due to legal requirements"
   * }
   */
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,

  // 5xx Server Errors
  /** 
   * A generic error message, given when an unexpected condition was encountered.
   * This is the default error code for server-side errors.
   * @example
   * GET /resource
   * Response: 500 Internal Server Error
   * {
   *   "error": "An unexpected error occurred"
   * }
   */
  INTERNAL_SERVER_ERROR = 500,
  /** 
   * The server either does not recognize the request method, or it lacks the ability to fulfill the request.
   * @example
   * PATCH /resource
   * Response: 501 Not Implemented
   * {
   *   "error": "PATCH method is not supported"
   * }
   */
  NOT_IMPLEMENTED = 501,
  /** 
   * The server was acting as a gateway or proxy and received an invalid response from the upstream server.
   * @example
   * GET /api/resource
   * Response: 502 Bad Gateway
   * {
   *   "error": "Upstream server returned an invalid response"
   * }
   */
  BAD_GATEWAY = 502,
  /** 
   * The server is currently unavailable (because it is overloaded or down for maintenance).
   * The client should try again later.
   * @example
   * GET /resource
   * Response: 503 Service Unavailable
   * Retry-After: 3600
   * {
   *   "error": "Service is temporarily unavailable. Please try again in 1 hour"
   * }
   */
  SERVICE_UNAVAILABLE = 503,
  /** 
   * The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.
   * @example
   * GET /api/resource
   * Response: 504 Gateway Timeout
   * {
   *   "error": "Upstream server did not respond in time"
   * }
   */
  GATEWAY_TIMEOUT = 504,
  /** 
   * The server does not support the HTTP protocol version used in the request.
   * @example
   * GET /resource HTTP/2.0
   * Response: 505 HTTP Version Not Supported
   * {
   *   "error": "HTTP/2.0 is not supported"
   * }
   */
  HTTP_VERSION_NOT_SUPPORTED = 505,
  /** 
   * Transparent content negotiation for the request results in a circular reference.
   * Used when the server cannot negotiate an appropriate representation of the resource.
   */
  VARIANT_ALSO_NEGOTIATES = 506,
  /** 
   * The server is unable to store the representation needed to complete the request.
   * Used in WebDAV when the server cannot store the representation.
   * @example
   * PUT /large-file
   * Response: 507 Insufficient Storage
   * {
   *   "error": "Server storage quota exceeded"
   * }
   */
  INSUFFICIENT_STORAGE = 507,
  /** 
   * The server detected an infinite loop while processing the request.
   * Used in WebDAV when a loop is detected in the request processing.
   * @example
   * GET /resource
   * Response: 508 Loop Detected
   * {
   *   "error": "Infinite loop detected in request processing"
   * }
   */
  LOOP_DETECTED = 508,
  /** 
   * Further extensions to the request are required for the server to fulfill it.
   * @example
   * GET /resource
   * Response: 510 Not Extended
   * {
   *   "error": "Additional extensions are required"
   * }
   */
  NOT_EXTENDED = 510,
  /** 
   * The client needs to authenticate to gain network access.
   * Used by some firewalls and proxies to require authentication before allowing access to the network.
   * @example
   * GET /resource
   * Response: 511 Network Authentication Required
   * {
   *   "error": "Network authentication required",
   *   "loginUrl": "https://network-login.example.com"
   * }
   */
  NETWORK_AUTHENTICATION_REQUIRED = 511
}

/**
 * HTTP Status Messages
 * Maps HTTP status codes to their corresponding messages
 */
export const HttpStatusMessage: Record<HttpStatus, string> = {
  [HttpStatus.CONTINUE]: 'Continue',
  [HttpStatus.SWITCHING_PROTOCOLS]: 'Switching Protocols',
  [HttpStatus.PROCESSING]: 'Processing',
  [HttpStatus.EARLY_HINTS]: 'Early Hints',
  
  [HttpStatus.OK]: 'OK',
  [HttpStatus.CREATED]: 'Created',
  [HttpStatus.ACCEPTED]: 'Accepted',
  [HttpStatus.NON_AUTHORITATIVE_INFORMATION]: 'Non-Authoritative Information',
  [HttpStatus.NO_CONTENT]: 'No Content',
  [HttpStatus.RESET_CONTENT]: 'Reset Content',
  [HttpStatus.PARTIAL_CONTENT]: 'Partial Content',
  [HttpStatus.MULTI_STATUS]: 'Multi-Status',
  [HttpStatus.ALREADY_REPORTED]: 'Already Reported',
  [HttpStatus.IM_USED]: 'IM Used',
  
  [HttpStatus.MULTIPLE_CHOICES]: 'Multiple Choices',
  [HttpStatus.MOVED_PERMANENTLY]: 'Moved Permanently',
  [HttpStatus.FOUND]: 'Found',
  [HttpStatus.SEE_OTHER]: 'See Other',
  [HttpStatus.NOT_MODIFIED]: 'Not Modified',
  [HttpStatus.USE_PROXY]: 'Use Proxy',
  [HttpStatus.TEMPORARY_REDIRECT]: 'Temporary Redirect',
  [HttpStatus.PERMANENT_REDIRECT]: 'Permanent Redirect',
  
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.PAYMENT_REQUIRED]: 'Payment Required',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.METHOD_NOT_ALLOWED]: 'Method Not Allowed',
  [HttpStatus.NOT_ACCEPTABLE]: 'Not Acceptable',
  [HttpStatus.PROXY_AUTHENTICATION_REQUIRED]: 'Proxy Authentication Required',
  [HttpStatus.REQUEST_TIMEOUT]: 'Request Timeout',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.GONE]: 'Gone',
  [HttpStatus.LENGTH_REQUIRED]: 'Length Required',
  [HttpStatus.PRECONDITION_FAILED]: 'Precondition Failed',
  [HttpStatus.PAYLOAD_TOO_LARGE]: 'Payload Too Large',
  [HttpStatus.URI_TOO_LONG]: 'URI Too Long',
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: 'Unsupported Media Type',
  [HttpStatus.RANGE_NOT_SATISFIABLE]: 'Range Not Satisfiable',
  [HttpStatus.EXPECTATION_FAILED]: 'Expectation Failed',
  [HttpStatus.IM_A_TEAPOT]: 'I\'m a teapot',
  [HttpStatus.MISDIRECTED_REQUEST]: 'Misdirected Request',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [HttpStatus.LOCKED]: 'Locked',
  [HttpStatus.FAILED_DEPENDENCY]: 'Failed Dependency',
  [HttpStatus.TOO_EARLY]: 'Too Early',
  [HttpStatus.UPGRADE_REQUIRED]: 'Upgrade Required',
  [HttpStatus.PRECONDITION_REQUIRED]: 'Precondition Required',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
  [HttpStatus.REQUEST_HEADER_FIELDS_TOO_LARGE]: 'Request Header Fields Too Large',
  [HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS]: 'Unavailable For Legal Reasons',
  
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HttpStatus.NOT_IMPLEMENTED]: 'Not Implemented',
  [HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout',
  [HttpStatus.HTTP_VERSION_NOT_SUPPORTED]: 'HTTP Version Not Supported',
  [HttpStatus.VARIANT_ALSO_NEGOTIATES]: 'Variant Also Negotiates',
  [HttpStatus.INSUFFICIENT_STORAGE]: 'Insufficient Storage',
  [HttpStatus.LOOP_DETECTED]: 'Loop Detected',
  [HttpStatus.NOT_EXTENDED]: 'Not Extended',
  [HttpStatus.NETWORK_AUTHENTICATION_REQUIRED]: 'Network Authentication Required'
};

/**
 * Helper function to get the message for a given HTTP status code
 * @param status The HTTP status code
 * @returns The corresponding status message
 */
export function getHttpStatusMessage(status: HttpStatus): string {
  return HttpStatusMessage[status];
}

/**
 * Helper function to check if a status code is successful (2xx)
 * @param status The HTTP status code
 * @returns True if the status code is in the 2xx range
 */
export function isSuccessful(status: HttpStatus): boolean {
  return status >= 200 && status < 300;
}

/**
 * Helper function to check if a status code is a client error (4xx)
 * @param status The HTTP status code
 * @returns True if the status code is in the 4xx range
 */
export function isClientError(status: HttpStatus): boolean {
  return status >= 400 && status < 500;
}

/**
 * Helper function to check if a status code is a server error (5xx)
 * @param status The HTTP status code
 * @returns True if the status code is in the 5xx range
 */
export function isServerError(status: HttpStatus): boolean {
  return status >= 500 && status < 600;
}
