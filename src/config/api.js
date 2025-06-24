// API Configuration
export const API_CONFIG = {
    MEETSTREAM: {
        API_KEY: 'ms_47eUPCS2y9OzT2qMqgSS8toNQltcAmsg',
        BASE_URL: '/v1',
        ENDPOINTS: {
            MEETINGS: '/meetings',
            TRANSCRIPT: '/transcript',
            SEARCH: '/search'
        }
    }
};

// Environment-based configuration
export const getApiConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    
    return {
        ...API_CONFIG,
        // Override with environment variables if available
        MEETSTREAM: {
            ...API_CONFIG.MEETSTREAM,
            API_KEY: process.env.REACT_APP_MEETSTREAM_API_KEY || API_CONFIG.MEETSTREAM.API_KEY,
        }
    };
};