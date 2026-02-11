/**
 * API Configuration Template
 * 
 * This is a template file showing how to configure your API.
 * Copy this to create your own config.js:
 * 
 * cp api/config.template.js api/config.js
 * 
 * Then edit config.js with your actual API key.
 */

// Example OpenAI Configuration
export const API_CONFIG = {
    // Provider name (for logging/debugging)
    PROVIDER: 'OpenAI',
    
    // Your API key - REPLACE THIS!
    API_KEY: 'YOUR_API_KEY_HERE',
    
    // API endpoint
    BASE_URL: 'https://api.openai.com/v1',
    
    // Model to use
    MODEL: 'gpt-3.5-turbo',  // Options: gpt-3.5-turbo, gpt-4, gpt-4-turbo
    
    // Maximum tokens in response
    MAX_TOKENS: 2000,
    
    // Temperature (0.0 - 1.0): Lower = more focused, Higher = more creative
    TEMPERATURE: 0.7,
    
    // Rate limiting
    MAX_REQUESTS_PER_MINUTE: 10,
    
    // Request timeout (milliseconds)
    TIMEOUT: 30000,
    
    // Number of retry attempts for failed requests
    MAX_RETRIES: 3,
    
    // Mock mode (set to false when using real API)
    USE_MOCK_DATA: true,
    
    // Mock delay for testing (milliseconds)
    MOCK_DELAY: 1000
};

// Alternative: Google Gemini Configuration
/*
export const API_CONFIG = {
    PROVIDER: 'Gemini',
    API_KEY: 'YOUR_GEMINI_API_KEY',
    BASE_URL: 'https://generativelanguage.googleapis.com/v1',
    MODEL: 'gemini-pro',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    MAX_REQUESTS_PER_MINUTE: 10,
    TIMEOUT: 30000,
    MAX_RETRIES: 3,
    USE_MOCK_DATA: false,
    MOCK_DELAY: 1000
};
*/

// Alternative: Anthropic Claude Configuration
/*
export const API_CONFIG = {
    PROVIDER: 'Claude',
    API_KEY: 'YOUR_CLAUDE_API_KEY',
    BASE_URL: 'https://api.anthropic.com/v1',
    MODEL: 'claude-3-sonnet-20240229',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    MAX_REQUESTS_PER_MINUTE: 10,
    TIMEOUT: 30000,
    MAX_RETRIES: 3,
    USE_MOCK_DATA: false,
    MOCK_DELAY: 1000
};
*/

/**
 * SETUP STEPS:
 * ============
 * 
 * 1. Choose your AI provider (OpenAI, Gemini, or Claude)
 * 2. Get an API key from the provider's website
 * 3. Copy this template to config.js
 * 4. Replace 'YOUR_API_KEY_HERE' with your actual key
 * 5. Set USE_MOCK_DATA to false
 * 6. Save and reload your application
 * 
 * SECURITY:
 * =========
 * - Never commit config.js with real API keys
 * - Add config.js to .gitignore
 * - Use environment variables in production
 * - Consider backend proxy for sensitive keys
 * 
 * TESTING:
 * ========
 * - Leave USE_MOCK_DATA as true for testing
 * - No API key needed for mock mode
 * - Perfect for UI/UX testing
 */
