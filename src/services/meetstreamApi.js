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
            'Authorization': `ApiKey ${this.apiKey}`,
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

    // Fetch meeting transcript with fallback to mock data
    async getMeetingTranscriptWithFallback(meetingId) {
        try {
            // First attempt to get real transcript
            const transcript = await this.getMeetingTranscript(meetingId);
            return transcript;
        } catch (error) {
            console.warn('Failed to fetch real transcript, falling back to mock data:', error);
            
            // Return mock transcript data as fallback
            return {
                segments: [
                    {
                        speaker: 'Alice Johnson',
                        text: 'Good morning everyone, let\'s start with our weekly standup. How did everyone\'s tasks go this week?'
                    },
                    {
                        speaker: 'Bob Smith',
                        text: 'I completed the user authentication feature and started working on the dashboard components. No blockers so far.'
                    },
                    {
                        speaker: 'Carol Davis',
                        text: 'I finished the API integration for the payment system. We should be ready for testing by tomorrow.'
                    },
                    {
                        speaker: 'Alice Johnson',
                        text: 'Great work everyone. Let\'s discuss the priorities for next week and any potential challenges we might face.'
                    }
                ]
            };
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

    // Get mock meetings for testing/fallback
    getMockMeetings() {
        return [
            {
                id: 'mock-meeting-1',
                title: 'Weekly Team Standup',
                start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                duration: 30,
                participants: ['Alice Johnson', 'Bob Smith', 'Carol Davis'],
                status: 'completed'
            },
            {
                id: 'mock-meeting-2',
                title: 'Product Strategy Review',
                start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                duration: 60,
                participants: ['David Wilson', 'Emma Brown', 'Frank Miller'],
                status: 'completed'
            },
            {
                id: 'mock-meeting-3',
                title: 'Client Presentation',
                start_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                duration: 45,
                participants: ['Grace Lee', 'Henry Taylor', 'Ivy Chen'],
                status: 'completed'
            },
            {
                id: 'mock-meeting-4',
                title: 'Engineering Sync',
                start_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
                duration: 30,
                participants: ['Jack Anderson', 'Kate Roberts', 'Liam Thompson'],
                status: 'completed'
            },
            {
                id: 'mock-meeting-5',
                title: 'Quarterly Planning',
                start_time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
                duration: 90,
                participants: ['Maya Patel', 'Noah Garcia', 'Olivia Martinez'],
                status: 'completed'
            }
        ];
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