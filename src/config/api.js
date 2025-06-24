// API Configuration
export const API_CONFIG = {
    MEETSTREAM: {
        // Your actual API key
        API_KEY: 'ms_H3XjWL4qeh0X9GqshgbZT9ku3MnBnI04',
        BASE_URL: 'https://api.meetstream.ai',
        ENDPOINTS: {
            BOTS: '/api/v1/bots',
            TRANSCRIPT: '/api/v1/transcript',
            CREATE_BOT: '/api/v1/bots/create_bot'
        }
    }
};

// Environment-based configuration
export const getApiConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    
    // Get the API key from environment variable or use the provided one
    const apiKey = process.env.REACT_APP_MEETSTREAM_API_KEY || API_CONFIG.MEETSTREAM.API_KEY;
    
    // Validate API key format (should start with 'ms_')
    if (apiKey && !apiKey.startsWith('ms_')) {
        console.warn('Invalid MeetStream API key format. API key should start with "ms_"');
        // Fall back to provided API key if environment variable is invalid
        return {
            ...API_CONFIG,
            MEETSTREAM: {
                ...API_CONFIG.MEETSTREAM,
                API_KEY: API_CONFIG.MEETSTREAM.API_KEY,
                BASE_URL: API_CONFIG.MEETSTREAM.BASE_URL,
            }
        };
    }
    
    return {
        ...API_CONFIG,
        MEETSTREAM: {
            ...API_CONFIG.MEETSTREAM,
            API_KEY: apiKey,
            BASE_URL: API_CONFIG.MEETSTREAM.BASE_URL,
        }
    };
};