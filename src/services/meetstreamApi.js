import { getApiConfig } from '../config/api';

const config = getApiConfig();

class MeetStreamAPI {
    constructor(apiKey = config.MEETSTREAM.API_KEY) {
        this.apiKey = apiKey;
        this.baseURL = config.MEETSTREAM.BASE_URL;
        
        // Validate API key format
        if (!this.apiKey || !this.apiKey.startsWith('ms_')) {
            console.error('Invalid MeetStream API key format. API key should start with "ms_"');
        }
    }

    // Get headers for API requests
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Handle API response errors
    async handleResponse(response, operation) {
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Failed to ${operation}: ${response.status} ${response.statusText}`;
            
            try {
                const errorData = JSON.parse(errorText);
                if (errorData.message) {
                    errorMessage = `${operation} API Error: ${errorData.message}`;
                }
            } catch (e) {
                // If error response is not JSON, use the text
                if (errorText) {
                    errorMessage = `${operation} API Error: ${errorText}`;
                }
            }
            
            console.error(`${operation} API Error:`, {
                status: response.status,
                statusText: response.statusText,
                body: errorText,
                headers: Object.fromEntries(response.headers.entries())
            });
            
            throw new Error(errorMessage);
        }
        
        return response.json();
    }

    // Fetch live meetings
    async getLiveMeetings() {
        try {
            const url = `${this.baseURL}/meetings/live`;
            console.log(`Fetching live meetings from URL: ${url}`);
            console.log('Using API key:', this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'No API key');
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'fetch live meetings');
            console.log('Live meetings data received:', data);
            return data;
        } catch (error) {
            console.error('Error fetching live meetings:', error);
            throw error;
        }
    }

    // Fetch meeting transcript by meeting ID
    async getMeetingTranscript(meetingId) {
        try {
            const url = `${this.baseURL}/meetings/${meetingId}/transcript`;
            console.log(`Fetching transcript from URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'fetch transcript');
            return data;
        } catch (error) {
            console.error('Error fetching meeting transcript:', error);
            throw error;
        }
    }

    // List all meetings
    async listMeetings(limit = 10, offset = 0) {
        try {
            const url = `${this.baseURL}/meetings?limit=${limit}&offset=${offset}`;
            console.log(`Fetching meetings from URL: ${url}`);
            console.log('Using API key:', this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'No API key');
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'load meetings');
            console.log('Meetings data received:', data);
            return data;
        } catch (error) {
            console.error('Error fetching meetings list:', error);
            throw error;
        }
    }

    // Search meetings by title or participants
    async searchMeetings(query) {
        try {
            const url = `${this.baseURL}/meetings/search?q=${encodeURIComponent(query)}`;
            console.log(`Searching meetings from URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'search meetings');
            console.log('Search results received:', data);
            return data;
        } catch (error) {
            console.error('Error searching meetings:', error);
            throw error;
        }
    }

    // Get meeting details
    async getMeetingDetails(meetingId) {
        try {
            const url = `${this.baseURL}/meetings/${meetingId}`;
            console.log(`Fetching meeting details from URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'fetch meeting details');
            return data;
        } catch (error) {
            console.error('Error fetching meeting details:', error);
            throw error;
        }
    }

    // Format transcript text from API response
    formatTranscriptText(transcriptData) {
        if (!transcriptData || !transcriptData.segments) {
            return '';
        }

        return transcriptData.segments
            .map(segment => {
                const speaker = segment.speaker || 'Unknown';
                const text = segment.text || '';
                return `"${text}"`;
            })
            .join('\n\n');
    }

    // Get recent meetings for quick access
    async getRecentMeetings(count = 5) {
        try {
            const meetings = await this.listMeetings(count, 0);
            return meetings.meetings || [];
        } catch (error) {
            console.error('Error fetching recent meetings:', error);
            throw error;
        }
    }
}

export default MeetStreamAPI;