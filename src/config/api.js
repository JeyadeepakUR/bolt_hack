// API Configuration
export const API_CONFIG = {
    MEETSTREAM: {
        API_KEY: "ms_H3XjWL4qeh0X9GqshgbZT9ku3MnBnI04",
        BASE_URL: '/v1',
        ENDPOINTS: {
            MEETINGS: '/meetings',
            TRANSCRIPT: '/meetings/{id}/transcript',
            SEARCH: '/meetings/search',
            LIVE_MEETINGS: '/meetings/live',
            MEETING_DETAILS: '/meetings/{id}'
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