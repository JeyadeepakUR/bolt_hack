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
        
        console.log('MeetStream API initialized with key:', this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'No API key');
    }

    // Get headers for API requests - using Token authentication as per Postman collection
    getHeaders() {
        return {
            'Authorization': `Token ${this.apiKey}`,
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

    // Get bot status (this is what we'll use to list "meetings" - active bots)
    async getBotStatus(botId) {
        try {
            const url = `${this.baseURL}/api/v1/bots/${botId}/status`;
            console.log(`Fetching bot status from URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'fetch bot status');
            return data;
        } catch (error) {
            console.error('Error fetching bot status:', error);
            throw error;
        }
    }

    // Get bot details (this gives us meeting information)
    async getBotDetails(botId) {
        try {
            const url = `${this.baseURL}/api/v1/bots/${botId}/detail`;
            console.log(`Fetching bot details from URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'fetch bot details');
            return data;
        } catch (error) {
            console.error('Error fetching bot details:', error);
            throw error;
        }
    }

    // Get transcript by transcript ID
    async getTranscript(transcriptId, raw = false) {
        try {
            const url = `${this.baseURL}/api/v1/transcript/${transcriptId}/get_transcript${raw ? '?raw=True' : ''}`;
            console.log(`Fetching transcript from URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'fetch transcript');
            return data;
        } catch (error) {
            console.error('Error fetching transcript:', error);
            throw error;
        }
    }

    // Create a new bot (meeting)
    async createBot(meetingConfig) {
        try {
            const url = `${this.baseURL}/api/v1/bots/create_bot`;
            console.log(`Creating bot at URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(meetingConfig)
            });

            const data = await this.handleResponse(response, 'create bot');
            return data;
        } catch (error) {
            console.error('Error creating bot:', error);
            throw error;
        }
    }

    // Remove a bot
    async removeBot(botId) {
        try {
            const url = `${this.baseURL}/api/v1/bots/${botId}/remove_bot`;
            console.log(`Removing bot from URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'remove bot');
            return data;
        } catch (error) {
            console.error('Error removing bot:', error);
            throw error;
        }
    }

    // Get audio from bot
    async getBotAudio(botId) {
        try {
            const url = `${this.baseURL}/api/v1/bots/${botId}/get_audio`;
            console.log(`Fetching bot audio from URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'fetch bot audio');
            return data;
        } catch (error) {
            console.error('Error fetching bot audio:', error);
            throw error;
        }
    }

    // Get manifest from bot
    async getBotManifest(botId) {
        try {
            const url = `${this.baseURL}/api/v1/bots/${botId}/get_manifest`;
            console.log(`Fetching bot manifest from URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'fetch bot manifest');
            return data;
        } catch (error) {
            console.error('Error fetching bot manifest:', error);
            throw error;
        }
    }

    // Get user's bots (this represents their meetings/sessions)
    async getUserBots() {
        try {
            // Since there's no direct endpoint to list all user bots,
            // we'll return mock data that represents the user's meeting history
            console.log('Returning mock bot data (no direct endpoint to list user bots)');
            return this.getMockMeetings();
        } catch (error) {
            console.error('Error fetching user bots:', error);
            return this.getMockMeetings();
        }
    }

    // Legacy methods for compatibility with existing UI
    async getLiveMeetings() {
        try {
            // Since the actual API doesn't have a direct "live meetings" endpoint,
            // we'll return mock data that represents active bots
            console.log('Returning mock live meetings data (API uses bot-based structure)');
            return this.getMockLiveMeetings();
        } catch (error) {
            console.error('Error fetching live meetings:', error);
            return this.getMockLiveMeetings();
        }
    }

    // Legacy method - return mock data since API structure is different
    async listMeetings(limit = 10, offset = 0) {
        try {
            console.log('Returning mock meetings data (API uses bot-based structure)');
            return { meetings: this.getMockMeetings() };
        } catch (error) {
            console.error('Error fetching meetings list:', error);
            return { meetings: this.getMockMeetings() };
        }
    }

    // Legacy method - return mock data
    async searchMeetings(query) {
        try {
            console.log('Returning mock search results (API uses bot-based structure)');
            const mockMeetings = this.getMockMeetings();
            const filteredMeetings = mockMeetings.filter(meeting => 
                meeting.title.toLowerCase().includes(query.toLowerCase()) ||
                meeting.participants.some(p => 
                    (typeof p === 'string' ? p : p.name || p.email || '').toLowerCase().includes(query.toLowerCase())
                )
            );
            return { meetings: filteredMeetings };
        } catch (error) {
            console.error('Error searching meetings:', error);
            return { meetings: [] };
        }
    }

    // Legacy method for compatibility
    async getMeetingDetails(meetingId) {
        try {
            // If this is a bot ID, try to get bot details
            if (meetingId.startsWith('bot_')) {
                return await this.getBotDetails(meetingId);
            }
            
            // Otherwise return mock data
            const mockMeetings = this.getMockMeetings();
            return mockMeetings.find(m => m.id === meetingId) || mockMeetings[0];
        } catch (error) {
            console.error('Error fetching meeting details:', error);
            const mockMeetings = this.getMockMeetings();
            return mockMeetings[0];
        }
    }

    // Legacy method for compatibility
    async getMeetingTranscript(meetingId) {
        try {
            // If this looks like a transcript ID, use the transcript endpoint
            if (meetingId.startsWith('transcript_')) {
                return await this.getTranscript(meetingId.replace('transcript_', ''));
            }
            
            // If this is a bot ID, try to get its transcript
            if (meetingId.startsWith('bot_')) {
                // For now, return mock transcript since we need the transcript ID
                return this.getMockTranscript();
            }
            
            // Otherwise return mock transcript
            return this.getMockTranscript();
        } catch (error) {
            console.error('Error fetching meeting transcript:', error);
            return this.getMockTranscript();
        }
    }

    // Updated method with fallback
    async getMeetingTranscriptWithFallback(meetingId) {
        try {
            // Try to get real transcript if it's a transcript ID
            if (meetingId.startsWith('transcript_')) {
                const transcript = await this.getTranscript(meetingId.replace('transcript_', ''));
                return transcript;
            }
            
            // If it's a bot ID, try to get the transcript
            if (meetingId.startsWith('bot_')) {
                // First get bot details to find transcript ID
                try {
                    const botDetails = await this.getBotDetails(meetingId);
                    if (botDetails && botDetails.transcript_id) {
                        return await this.getTranscript(botDetails.transcript_id);
                    }
                } catch (e) {
                    console.warn('Could not get bot details or transcript:', e);
                }
            }
            
            // Otherwise return mock transcript
            return this.getMockTranscript();
        } catch (error) {
            console.warn('Failed to fetch real transcript, falling back to mock data:', error);
            return this.getMockTranscript();
        }
    }

    // Get mock live meetings (representing active bots)
    getMockLiveMeetings() {
        return [
            {
                id: 'bot_live_001',
                title: 'Daily Standup - Live',
                start_time: new Date().toISOString(),
                status: 'live',
                participants: [
                    { name: 'Alice Johnson', email: 'alice@company.com' },
                    { name: 'Bob Smith', email: 'bob@company.com' }
                ],
                bot_name: 'standup-bot',
                meeting_link: 'https://zoom.us/j/123456789'
            },
            {
                id: 'bot_live_002',
                title: 'Client Call - In Progress',
                start_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
                status: 'live',
                participants: [
                    { name: 'Carol Davis', email: 'carol@company.com' },
                    { name: 'David Wilson', email: 'david@client.com' }
                ],
                bot_name: 'client-bot',
                meeting_link: 'https://meet.google.com/abc-defg-hij'
            }
        ];
    }

    // Get mock meetings for testing/fallback
    getMockMeetings() {
        return [
            {
                id: 'bot_001',
                title: 'Weekly Team Standup',
                start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                duration: 1800, // 30 minutes in seconds
                participants: [
                    { name: 'Alice Johnson', email: 'alice@company.com' },
                    { name: 'Bob Smith', email: 'bob@company.com' },
                    { name: 'Carol Davis', email: 'carol@company.com' }
                ],
                status: 'completed',
                bot_name: 'weekly-standup-bot',
                transcript_id: 'transcript_001'
            },
            {
                id: 'bot_002',
                title: 'Product Strategy Review',
                start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                duration: 3600, // 60 minutes in seconds
                participants: [
                    { name: 'David Wilson', email: 'david@company.com' },
                    { name: 'Emma Brown', email: 'emma@company.com' },
                    { name: 'Frank Miller', email: 'frank@company.com' }
                ],
                status: 'completed',
                bot_name: 'strategy-bot',
                transcript_id: 'transcript_002'
            },
            {
                id: 'bot_003',
                title: 'Client Presentation',
                start_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                duration: 2700, // 45 minutes in seconds
                participants: [
                    { name: 'Grace Lee', email: 'grace@company.com' },
                    { name: 'Henry Taylor', email: 'henry@client.com' },
                    { name: 'Ivy Chen', email: 'ivy@client.com' }
                ],
                status: 'completed',
                bot_name: 'presentation-bot',
                transcript_id: 'transcript_003'
            },
            {
                id: 'bot_004',
                title: 'Engineering Sync',
                start_time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
                duration: 1800, // 30 minutes in seconds
                participants: [
                    { name: 'Jack Anderson', email: 'jack@company.com' },
                    { name: 'Kate Roberts', email: 'kate@company.com' },
                    { name: 'Liam Thompson', email: 'liam@company.com' }
                ],
                status: 'completed',
                bot_name: 'eng-sync-bot',
                transcript_id: 'transcript_004'
            },
            {
                id: 'bot_005',
                title: 'Quarterly Planning',
                start_time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
                duration: 5400, // 90 minutes in seconds
                participants: [
                    { name: 'Maya Patel', email: 'maya@company.com' },
                    { name: 'Noah Garcia', email: 'noah@company.com' },
                    { name: 'Olivia Martinez', email: 'olivia@company.com' }
                ],
                status: 'completed',
                bot_name: 'planning-bot',
                transcript_id: 'transcript_005'
            }
        ];
    }

    // Get mock transcript with realistic meeting content
    getMockTranscript() {
        return {
            transcript_id: 'transcript_001',
            segments: [
                {
                    speaker: 'Alice Johnson',
                    text: 'Good morning everyone, let\'s start with our weekly standup. How did everyone\'s tasks go this week?',
                    timestamp: '2024-01-15T10:00:00Z'
                },
                {
                    speaker: 'Bob Smith',
                    text: 'I completed the user authentication feature and started working on the dashboard components. No blockers so far.',
                    timestamp: '2024-01-15T10:01:30Z'
                },
                {
                    speaker: 'Carol Davis',
                    text: 'I finished the API integration for the payment system. We should be ready for testing by tomorrow.',
                    timestamp: '2024-01-15T10:03:00Z'
                },
                {
                    speaker: 'Alice Johnson',
                    text: 'Great work everyone. Let\'s discuss the priorities for next week and any potential challenges we might face.',
                    timestamp: '2024-01-15T10:04:30Z'
                },
                {
                    speaker: 'Bob Smith',
                    text: 'I think we should focus on the mobile responsiveness next. The dashboard looks great on desktop but needs work on mobile.',
                    timestamp: '2024-01-15T10:05:00Z'
                },
                {
                    speaker: 'Carol Davis',
                    text: 'Agreed. I can help with the CSS media queries once the payment testing is complete. What if we gamify the user onboarding process?',
                    timestamp: '2024-01-15T10:06:15Z'
                },
                {
                    speaker: 'Alice Johnson',
                    text: 'That\'s an interesting idea! We could use AI to recommend learning paths based on how users interact with the interface.',
                    timestamp: '2024-01-15T10:07:30Z'
                },
                {
                    speaker: 'Bob Smith',
                    text: 'We could tie that into our feedback system and see which flows work best for different user types.',
                    timestamp: '2024-01-15T10:08:45Z'
                },
                {
                    speaker: 'Carol Davis',
                    text: 'What about creating a community aspect where users can share their progress and help each other?',
                    timestamp: '2024-01-15T10:10:00Z'
                },
                {
                    speaker: 'Alice Johnson',
                    text: 'We could also use voice interfaces for accessibility - like having users speak their preferences instead of clicking through menus.',
                    timestamp: '2024-01-15T10:11:15Z'
                }
            ]
        };
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
            return this.getMockMeetings().slice(0, count);
        }
    }
}

export default MeetStreamAPI;