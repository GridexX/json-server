# API Authentication Middleware

This directory contains middleware files for JSON Server authentication.

## Files

- `auth-middleware.js` - Simple API key authentication
- `auth-middleware-advanced.js` - Enhanced authentication with environment variable support

## Simple Authentication (`auth-middleware.js`)

Basic API key authentication that requires `apiKey` query parameter.

### Valid API Keys (Demo)
- `demo-api-key-123`
- `test-key-456` 
- `production-key-789`

### Usage Examples
```bash
# Valid request
curl "http://localhost:3000/posts?apiKey=demo-api-key-123"

# Invalid request (will return 401)
curl "http://localhost:3000/posts"

# Invalid key (will return 403)
curl "http://localhost:3000/posts?apiKey=invalid-key"
```

## Advanced Authentication (`auth-middleware-advanced.js`)

Enhanced middleware with environment variable support and multiple authentication methods.

### Environment Variables

- `JSON_SERVER_API_KEYS` - Comma-separated list of valid API keys
- `JSON_SERVER_REQUIRE_AUTH` - Set to 'false' to disable authentication (default: true)
- `JSON_SERVER_LOG_AUTH` - Set to 'true' to enable request logging (default: false)

### Authentication Methods

1. **Query Parameter**: `?apiKey=your-key` or `?api_key=your-key` or `?key=your-key`
2. **Header**: `X-API-Key: your-key`
3. **Authorization Header**: `Authorization: Bearer your-key`

### Docker Compose Configuration

To use the advanced middleware, update your docker-compose.yml:

```yaml
environment:
  - JSON_SERVER_OPTIONS=--middlewares /data/auth-middleware-advanced.js
  - JSON_SERVER_API_KEYS=prod-key-1,prod-key-2,prod-key-3
  - JSON_SERVER_LOG_AUTH=true
  - JSON_SERVER_REQUIRE_AUTH=true
```

### Usage Examples

```bash
# Query parameter
curl "http://localhost:3000/posts?apiKey=your-key"

# Header method
curl -H "X-API-Key: your-key" "http://localhost:3000/posts"

# Authorization header
curl -H "Authorization: Bearer your-key" "http://localhost:3000/posts"
```

## Switching Between Middlewares

Update the `JSON_SERVER_OPTIONS` environment variable in docker-compose.yml:

```yaml
# For simple middleware
JSON_SERVER_OPTIONS=--middlewares /data/auth-middleware.js

# For advanced middleware  
JSON_SERVER_OPTIONS=--middlewares /data/auth-middleware-advanced.js

# For no authentication
# Remove or comment out the JSON_SERVER_OPTIONS line
```

## Security Notes

- In production, always use environment variables for API keys
- Never commit real API keys to version control
- Consider using more secure authentication methods for production (JWT, OAuth, etc.)
- Enable request logging in development for debugging
