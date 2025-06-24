import { getApiConfig } from '../config/api';

const config = getApiConfig();

class MeetStreamAPI {
    constructor(apiKey = config.MEETSTREAM.API_KEY) {
        this.apiKey = apiKey;
        this.baseURL = config.MEETSTREAM.BASE_URL;
    }

    // Get headers for API requests
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    // Fetch meeting transcript by meeting ID
    async getMeetingTranscript(meetingId) {
        try {
            const url = `${this.baseURL}/meetings/${meetingId}/transcript`;
            console.log(`Fetching transcript from: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            console.log('Transcript API Response Status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Transcript API Error:', errorText);
                throw new Error(`Failed to fetch transcript: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Transcript data received:', data);
            return data;
        } catch (error) {
            console.error('Error fetching meeting transcript:', error);
            throw new Error(`Failed to load transcript: ${error.message}`);
        }
    }

    // List all meetings with proper pagination
    async listMeetings(limit = 20, offset = 0) {
        try {
            const url = `${this.baseURL}/meetings?limit=${limit}&offset=${offset}&status=completed`;
            console.log(`Fetching meetings from: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            console.log('List Meetings API Response Status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('List Meetings API Error:', errorText);
                throw new Error(`Failed to fetch meetings: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Meetings data received:', data);
            
            // Handle different response formats
            if (data.meetings) {
                return data.meetings;
            } else if (Array.isArray(data)) {
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching meetings list:', error);
            throw new Error(`Failed to load meetings: ${error.message}`);
        }
    }

    // Get live/active meetings
    async getLiveMeetings() {
        try {
            const url = `${this.baseURL}/meetings?status=live&limit=10`;
            console.log(`Fetching live meetings from: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Live Meetings API Error:', errorText);
                throw new Error(`Failed to fetch live meetings: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data.meetings || data || [];
        } catch (error) {
            console.error('Error fetching live meetings:', error);
            return [];
        }
    }

    // Search meetings by title or participants
    async searchMeetings(query) {
        try {
            const url = `${this.baseURL}/meetings/search?q=${encodeURIComponent(query)}&limit=20`;
            console.log(`Searching meetings: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            console.log('Search Meetings API Response Status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Search Meetings API Error:', errorText);
                throw new Error(`Failed to search meetings: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Search results received:', data);
            
            return {
                meetings: data.meetings || data.results || data || [],
                total: data.total || 0
            };
        } catch (error) {
            console.error('Error searching meetings:', error);
            throw new Error(`Failed to search meetings: ${error.message}`);
        }
    }

    // Get meeting details
    async getMeetingDetails(meetingId) {
        try {
            const url = `${this.baseURL}/meetings/${meetingId}`;
            console.log(`Fetching meeting details: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Meeting Details API Error:', errorText);
                throw new Error(`Failed to fetch meeting details: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching meeting details:', error);
            throw new Error(`Failed to load meeting details: ${error.message}`);
        }
    }

    // Format transcript text from API response
    formatTranscriptText(transcriptData) {
        console.log('Formatting transcript data:', transcriptData);
        
        if (!transcriptData) {
            return '';
        }

        // Handle different transcript formats
        if (typeof transcriptData === 'string') {
            return transcriptData;
        }

        // Handle segments format
        if (transcriptData.segments && Array.isArray(transcriptData.segments)) {
            return transcriptData.segments
                .map(segment => {
                    const speaker = segment.speaker || segment.name || 'Speaker';
                    const text = segment.text || segment.content || '';
                    const timestamp = segment.timestamp || segment.start_time || '';
                    
                    if (timestamp) {
                        return `[${this.formatTimestamp(timestamp)}] ${speaker}: "${text}"`;
                    } else {
                        return `${speaker}: "${text}"`;
                    }
                })
                .join('\n\n');
        }

        // Handle transcript array format
        if (transcriptData.transcript && Array.isArray(transcriptData.transcript)) {
            return transcriptData.transcript
                .map(item => {
                    const speaker = item.speaker || 'Speaker';
                    const text = item.text || item.content || '';
                    return `"${text}"`;
                })
                .join('\n\n');
        }

        // Handle simple text format
        if (transcriptData.text) {
            return transcriptData.text;
        }

        // Handle content format
        if (transcriptData.content) {
            return transcriptData.content;
        }

        // Fallback: try to extract any text content
        if (typeof transcriptData === 'object') {
            const textFields = ['transcript', 'content', 'text', 'body'];
            for (const field of textFields) {
                if (transcriptData[field]) {
                    return transcriptData[field];
                }
            }
        }

        return JSON.stringify(transcriptData, null, 2);
    }

    // Format timestamp for display
    formatTimestamp(timestamp) {
        if (typeof timestamp === 'number') {
            const minutes = Math.floor(timestamp / 60);
            const seconds = Math.floor(timestamp % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        return timestamp;
    }

    // Get recent meetings for quick access
    async getRecentMeetings(count = 10) {
        try {
            console.log('Fetching recent meetings...');
            const meetings = await this.listMeetings(count, 0);
            
            // Sort by date if available
            const sortedMeetings = meetings.sort((a, b) => {
                const dateA = new Date(a.created_at || a.start_time || a.date || 0);
                const dateB = new Date(b.created_at || b.start_time || b.date || 0);
                return dateB - dateA;
            });

            return sortedMeetings.slice(0, count);
        } catch (error) {
            console.error('Error fetching recent meetings:', error);
            
            // Return mock data if API fails for development
            if (process.env.NODE_ENV === 'development') {
                console.log('Returning mock data for development');
                return this.getMockMeetings();
            }
            
            throw error;
        }
    }

    // Mock data for development/testing
    getMockMeetings() {
        return [
            {
                id: 'mock-1',
                title: 'Product Strategy Brainstorm',
                start_time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                duration: 3600, // 1 hour
                participants: [
                    { name: 'Alice Johnson', email: 'alice@company.com' },
                    { name: 'Bob Chen', email: 'bob@company.com' },
                    { name: 'Charlie Davis', email: 'charlie@company.com' }
                ],
                status: 'completed',
                has_transcript: true
            },
            {
                id: 'mock-2',
                title: 'UX Research Discussion',
                start_time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                duration: 2700, // 45 minutes
                participants: [
                    { name: 'Diana Rodriguez', email: 'diana@company.com' },
                    { name: 'Eve Thompson', email: 'eve@company.com' }
                ],
                status: 'completed',
                has_transcript: true
            },
            {
                id: 'mock-3',
                title: 'Innovation Workshop',
                start_time: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                duration: 5400, // 1.5 hours
                participants: [
                    { name: 'Frank Wilson', email: 'frank@company.com' },
                    { name: 'Grace Kim', email: 'grace@company.com' },
                    { name: 'Henry Lee', email: 'henry@company.com' }
                ],
                status: 'completed',
                has_transcript: true
            }
        ];
    }

    // Mock transcript for development
    getMockTranscript(meetingId) {
        const transcripts = {
            'mock-1': {
                segments: [
                    {
                        speaker: 'Alice Johnson',
                        text: 'What if we gamify user onboarding using Duolingo-style feedback loops?',
                        timestamp: 120
                    },
                    {
                        speaker: 'Bob Chen',
                        text: 'That\'s interesting. Maybe we could use AI to recommend learning paths based on how fast users click through tasks.',
                        timestamp: 145
                    },
                    {
                        speaker: 'Charlie Davis',
                        text: 'Could we tie that into our feedback system and see which flows work best?',
                        timestamp: 180
                    },
                    {
                        speaker: 'Alice Johnson',
                        text: 'What about creating a community aspect where users can share their progress?',
                        timestamp: 210
                    },
                    {
                        speaker: 'Bob Chen',
                        text: 'We could also use voice interfaces for accessibility - like having users speak their preferences.',
                        timestamp: 240
                    }
                ]
            },
            'mock-2': {
                segments: [
                    {
                        speaker: 'Diana Rodriguez',
                        text: 'Our user research shows that people want more personalized experiences.',
                        timestamp: 60
                    },
                    {
                        speaker: 'Eve Thompson',
                        text: 'What if we create adaptive interfaces that learn from user behavior?',
                        timestamp: 90
                    },
                    {
                        speaker: 'Diana Rodriguez',
                        text: 'That could work. We could also implement smart notifications that adjust to user preferences.',
                        timestamp: 120
                    }
                ]
            },
            'mock-3': {
                segments: [
                    {
                        speaker: 'Frank Wilson',
                        text: 'Innovation requires breaking out of traditional thinking patterns.',
                        timestamp: 30
                    },
                    {
                        speaker: 'Grace Kim',
                        text: 'What if we used AI to identify patterns in successful innovations?',
                        timestamp: 60
                    },
                    {
                        speaker: 'Henry Lee',
                        text: 'We could create a system that suggests unexpected connections between ideas.',
                        timestamp: 90
                    }
                ]
            }
        };

        return transcripts[meetingId] || { segments: [] };
    }

    // Override getMeetingTranscript for development
    async getMeetingTranscriptWithFallback(meetingId) {
        try {
            return await this.getMeetingTranscript(meetingId);
        } catch (error) {
            console.warn('API call failed, using mock data:', error.message);
            
            if (process.env.NODE_ENV === 'development' && meetingId.startsWith('mock-')) {
                return this.getMockTranscript(meetingId);
            }
            
            throw error;
        }
    }
}

export default MeetStreamAPI;