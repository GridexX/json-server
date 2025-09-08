// Enhanced API Key Authentication Middleware for JSON Server
// Supports environment variables for API keys and more flexible configuration

module.exports = (req, res, next) => {
  // Get API keys from environment variable or use defaults
  const apiKeysEnv = process.env.JSON_SERVER_API_KEYS;
  const defaultApiKeys = [
    'demo-api-key-123',
    'test-key-456',
    'production-key-789'
  ];
  
  const validApiKeys = apiKeysEnv ? apiKeysEnv.split(',').map(key => key.trim()) : defaultApiKeys;

  // Configuration
  const config = {
    requireApiKey: process.env.JSON_SERVER_REQUIRE_AUTH !== 'false', // Default to true
    logRequests: process.env.JSON_SERVER_LOG_AUTH === 'true', // Default to false
    keyParamNames: ['apiKey', 'api_key', 'key'] // Multiple parameter names to check
  };

  // Skip authentication if disabled
  if (!config.requireApiKey) {
    if (config.logRequests) {
      console.log(`🔓 API request allowed (auth disabled): ${req.method} ${req.path}`);
    }
    return next();
  }

  // Get API key from multiple possible query parameters
  let apiKey = null;
  for (const paramName of config.keyParamNames) {
    if (req.query[paramName]) {
      apiKey = req.query[paramName];
      break;
    }
  }

  // Also check headers for API key
  if (!apiKey) {
    apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  }

  // Check if API key is provided
  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required.',
      examples: [
        'Query parameter: GET /posts?apiKey=your-api-key-here',
        'Header: X-API-Key: your-api-key-here',
        'Authorization header: Authorization: Bearer your-api-key-here'
      ],
      validKeys: process.env.NODE_ENV === 'development' ? validApiKeys : ['Contact admin for API keys']
    });
  }

  // Validate API key
  if (!validApiKeys.includes(apiKey)) {
    if (config.logRequests) {
      console.log(`❌ Invalid API key attempted: ${apiKey.substring(0, 8)}... from ${req.ip}`);
    }
    
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key provided.',
      hint: process.env.NODE_ENV === 'development' 
        ? `Valid keys: ${validApiKeys.join(', ')}`
        : 'Contact administrator for valid API key'
    });
  }

  // Log successful authentication
  if (config.logRequests) {
    console.log(`✅ API request authenticated: ${req.method} ${req.path} [${apiKey.substring(0, 8)}...] from ${req.ip}`);
  }

  // Add API key info to request object for use in other middlewares
  req.apiKey = apiKey;
  req.isAuthenticated = true;

  // API key is valid, continue to next middleware
  next();
};
