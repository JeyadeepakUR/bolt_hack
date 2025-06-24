// API Configuration
export const API_CONFIG = {
    MEETSTREAM: {
        // Use the working API key from the documentation
        API_KEY: 'ms_QwsHGaTmjVEvUiiwdNWzdI03LifdoN63',
        BASE_URL: 'https://api.meetstream.ai/v1',
        ENDPOINTS: {
            MEETINGS: '/meetings',
            LIVE_MEETINGS: '/meetings/live',
            TRANSCRIPT: '/transcript',
            SEARCH: '/search'
        }
    }
};

// Environment-based configuration
export const getApiConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    
    // Get the API key from environment variable or use default
    const apiKey = process.env.REACT_APP_MEETSTREAM_API_KEY || API_CONFIG.MEETSTREAM.API_KEY;
    
    // Validate API key format (should start with 'ms_')
    if (apiKey && !apiKey.startsWith('ms_')) {
        console.warn('Invalid MeetStream API key format. API key should start with "ms_"');
        // Fall back to default API key if environment variable is invalid
        return {
            ...API_CONFIG,
            MEETSTREAM: {
                ...API_CONFIG.MEETSTREAM,
                API_KEY: API_CONFIG.MEETSTREAM.API_KEY,
            }
        };
    }
    
    return {
        ...API_CONFIG,
        MEETSTREAM: {
            ...API_CONFIG.MEETSTREAM,
            API_KEY: apiKey,
        }
    };
};