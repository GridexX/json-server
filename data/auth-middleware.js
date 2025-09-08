// API Key Authentication Middleware for JSON Server
// This middleware enforces API key authentication via query parameter

module.exports = (req, res, next) => {
  // List of valid API keys (in production, this should come from environment variables or a database)
  const validApiKeys = [
    'demo-api-key-123',
    'test-key-456',
    'production-key-789'
  ];

  // Get API key from query parameters
  const apiKey = req.query.apiKey || req.query.api_key;

  // Check if API key is provided
  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is required. Please provide apiKey as a query parameter.',
      example: 'GET /posts?apiKey=your-api-key-here'
    });
  }

  // Validate API key
  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key provided.',
      hint: 'Use one of the demo keys: demo-api-key-123, test-key-456, or production-key-789'
    });
  }

  // Log successful authentication (optional)
  console.log(`✅ API request authenticated with key: ${apiKey.substring(0, 8)}...`);

  // API key is valid, continue to next middleware
  next();
};
