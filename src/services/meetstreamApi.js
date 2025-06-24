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
                } else if (errorData.detail) {
                    errorMessage = `${operation} API Error: ${errorData.detail}`;
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
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        } else {
            return response.text();
        }
    }

    // Get all user bots (this represents the user's meeting history)
    async getUserBots() {
        try {
            // Since there's no direct endpoint to list all user bots in the Postman collection,
            // we'll need to implement a workaround or use a different approach
            console.log('Attempting to fetch user bots...');
            
            // Try to get user information first (if such endpoint exists)
            // For now, we'll return mock data but with real API structure
            console.warn('No direct endpoint to list all user bots. Using mock data structure.');
            return this.getMockBotsWithRealStructure();
        } catch (error) {
            console.error('Error fetching user bots:', error);
            return this.getMockBotsWithRealStructure();
        }
    }

    // Get bot status (this is what we'll use to check if bots are live or completed)
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

    // Fetch real user bots with status checking (similar to Rebirth project approach)
    async fetchRealUserBots() {
        try {
            console.log('Attempting to fetch real user bots...');
            
            // Since there's no direct endpoint to list all user bots,
            // we would need to implement a different approach:
            // 1. Store bot IDs locally when they're created
            // 2. Use a backend service to track user's bots
            // 3. Use webhook callbacks to maintain bot list
            
            // For now, let's try to get some sample bot IDs and check their status
            const sampleBotIds = this.getSampleBotIds();
            const realBots = [];
            
            for (const botId of sampleBotIds) {
                try {
                    const botStatus = await this.getBotStatus(botId);
                    const botDetails = await this.getBotDetails(botId);
                    
                    realBots.push({
                        id: botId,
                        status: botStatus,
                        details: botDetails,
                        isReal: true
                    });
                } catch (error) {
                    console.warn(`Could not fetch data for bot ${botId}:`, error.message);
                }
            }
            
            if (realBots.length > 0) {
                console.log(`Found ${realBots.length} real bots`);
                return realBots;
            } else {
                console.log('No real bots found, using mock data');
                return this.getMockBotsWithRealStructure();
            }
        } catch (error) {
            console.error('Error fetching real user bots:', error);
            return this.getMockBotsWithRealStructure();
        }
    }

    // Get sample bot IDs (in a real implementation, these would come from your backend or local storage)
    getSampleBotIds() {
        // These would be actual bot IDs from your MeetStream account
        // You would get these from:
        // 1. Local storage after creating bots
        // 2. Your backend database
        // 3. Webhook callbacks when bots are created
        return [
            // Add your actual bot IDs here when you have them
            // 'bot_12345',
            // 'bot_67890',
        ];
    }

    // Legacy methods for compatibility with existing UI
    async getLiveMeetings() {
        try {
            console.log('Fetching live meetings (active bots)...');
            const userBots = await this.fetchRealUserBots();
            
            // Filter for live/active bots
            const liveBots = userBots.filter(bot => {
                if (bot.isReal && bot.status) {
                    return bot.status.status === 'active' || bot.status.status === 'live';
                }
                return bot.status === 'live' || bot.status === 'active';
            });
            
            return liveBots.length > 0 ? liveBots : this.getMockLiveMeetings();
        } catch (error) {
            console.error('Error fetching live meetings:', error);
            return this.getMockLiveMeetings();
        }
    }

    // Get recent meetings (completed bots)
    async getRecentMeetings(count = 15) {
        try {
            console.log('Fetching recent meetings (completed bots)...');
            const userBots = await this.fetchRealUserBots();
            
            // Filter for completed bots and sort by date
            const completedBots = userBots
                .filter(bot => {
                    if (bot.isReal && bot.status) {
                        return bot.status.status === 'completed' || bot.status.status === 'finished';
                    }
                    return bot.status === 'completed';
                })
                .sort((a, b) => {
                    const dateA = new Date(a.details?.created_at || a.start_time || 0);
                    const dateB = new Date(b.details?.created_at || b.start_time || 0);
                    return dateB - dateA; // Most recent first
                })
                .slice(0, count);
            
            return completedBots.length > 0 ? completedBots : this.getMockMeetings().slice(0, count);
        } catch (error) {
            console.error('Error fetching recent meetings:', error);
            return this.getMockMeetings().slice(0, count);
        }
    }

    // Search meetings/bots
    async searchMeetings(query) {
        try {
            console.log('Searching meetings for:', query);
            const allBots = await this.fetchRealUserBots();
            
            const filteredBots = allBots.filter(bot => {
                const title = bot.details?.bot_name || bot.title || '';
                const participants = bot.details?.participants || bot.participants || [];
                
                return title.toLowerCase().includes(query.toLowerCase()) ||
                       participants.some(p => 
                           (typeof p === 'string' ? p : p.name || p.email || '').toLowerCase().includes(query.toLowerCase())
                       );
            });
            
            return { meetings: filteredBots };
        } catch (error) {
            console.error('Error searching meetings:', error);
            return { meetings: this.getMockMeetings() };
        }
    }

    // Get meeting transcript with real API integration
    async getMeetingTranscriptWithFallback(meetingId) {
        try {
            console.log('Fetching transcript for meeting:', meetingId);
            
            // If this is a real bot, try to get its transcript
            if (meetingId.startsWith('bot_')) {
                try {
                    // First get bot details to find transcript ID
                    const botDetails = await this.getBotDetails(meetingId);
                    console.log('Bot details:', botDetails);
                    
                    if (botDetails && botDetails.transcript_id) {
                        console.log('Found transcript ID:', botDetails.transcript_id);
                        const transcript = await this.getTranscript(botDetails.transcript_id);
                        return transcript;
                    } else {
                        console.warn('No transcript ID found in bot details');
                    }
                } catch (e) {
                    console.warn('Could not get bot details or transcript:', e);
                }
            }
            
            // If this looks like a transcript ID, use it directly
            if (meetingId.startsWith('transcript_')) {
                const transcriptId = meetingId.replace('transcript_', '');
                return await this.getTranscript(transcriptId);
            }
            
            // Fallback to mock transcript
            console.log('Falling back to mock transcript');
            return this.getMockTranscript();
        } catch (error) {
            console.warn('Failed to fetch real transcript, falling back to mock data:', error);
            return this.getMockTranscript();
        }
    }

    // Format transcript text from API response
    formatTranscriptText(transcriptData) {
        if (!transcriptData) {
            return '';
        }

        // Handle different transcript formats
        if (typeof transcriptData === 'string') {
            return transcriptData;
        }

        if (transcriptData.segments && Array.isArray(transcriptData.segments)) {
            return transcriptData.segments
                .map(segment => {
                    const speaker = segment.speaker || 'Unknown';
                    const text = segment.text || '';
                    return `"${text}"`;
                })
                .join('\n\n');
        }

        if (transcriptData.transcript) {
            return transcriptData.transcript;
        }

        if (transcriptData.text) {
            return transcriptData.text;
        }

        // If it's an object with unknown structure, try to extract text
        if (typeof transcriptData === 'object') {
            const possibleTextFields = ['content', 'body', 'message', 'data'];
            for (const field of possibleTextFields) {
                if (transcriptData[field]) {
                    return transcriptData[field];
                }
            }
        }

        return JSON.stringify(transcriptData, null, 2);
    }

    // Get mock bots with real API structure
    getMockBotsWithRealStructure() {
        return [
            {
                id: 'bot_demo_001',
                bot_name: 'Weekly Team Standup Bot',
                status: 'completed',
                created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                meeting_link: 'https://zoom.us/j/123456789',
                transcript_id: 'transcript_demo_001',
                details: {
                    bot_name: 'Weekly Team Standup Bot',
                    participants: ['alice@company.com', 'bob@company.com', 'carol@company.com'],
                    duration: 1800,
                    audio_required: true,
                    video_required: false
                },
                isReal: false
            },
            {
                id: 'bot_demo_002',
                bot_name: 'Product Strategy Review Bot',
                status: 'completed',
                created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                meeting_link: 'https://meet.google.com/abc-defg-hij',
                transcript_id: 'transcript_demo_002',
                details: {
                    bot_name: 'Product Strategy Review Bot',
                    participants: ['david@company.com', 'emma@company.com', 'frank@company.com'],
                    duration: 3600,
                    audio_required: true,
                    video_required: true
                },
                isReal: false
            },
            {
                id: 'bot_demo_003',
                bot_name: 'Client Presentation Bot',
                status: 'completed',
                created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                meeting_link: 'https://teams.microsoft.com/l/meetup-join/xyz',
                transcript_id: 'transcript_demo_003',
                details: {
                    bot_name: 'Client Presentation Bot',
                    participants: ['grace@company.com', 'henry@client.com', 'ivy@client.com'],
                    duration: 2700,
                    audio_required: true,
                    video_required: false
                },
                isReal: false
            }
        ];
    }

    // Get mock live meetings (representing active bots)
    getMockLiveMeetings() {
        return [
            {
                id: 'bot_live_001',
                bot_name: 'Daily Standup Bot - Live',
                status: 'live',
                created_at: new Date().toISOString(),
                meeting_link: 'https://zoom.us/j/987654321',
                details: {
                    bot_name: 'Daily Standup Bot - Live',
                    participants: ['alice@company.com', 'bob@company.com'],
                    audio_required: true,
                    video_required: false
                },
                isReal: false
            }
        ];
    }

    // Legacy methods for backward compatibility
    getMockMeetings() {
        return this.getMockBotsWithRealStructure().map(bot => ({
            id: bot.id,
            title: bot.bot_name || bot.details?.bot_name || 'Untitled Meeting',
            start_time: bot.created_at,
            duration: bot.details?.duration || 1800,
            participants: bot.details?.participants || [],
            status: bot.status,
            bot_name: bot.bot_name,
            transcript_id: bot.transcript_id,
            meeting_link: bot.meeting_link
        }));
    }

    // Get mock transcript with realistic meeting content
    getMockTranscript() {
        return {
            transcript_id: 'transcript_demo_001',
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

    // List meetings (legacy compatibility)
    async listMeetings(limit = 10, offset = 0) {
        try {
            const meetings = await this.getRecentMeetings(limit);
            return { meetings };
        } catch (error) {
            console.error('Error listing meetings:', error);
            return { meetings: this.getMockMeetings() };
        }
    }

    // Get meeting details (legacy compatibility)
    async getMeetingDetails(meetingId) {
        try {
            if (meetingId.startsWith('bot_')) {
                const botDetails = await this.getBotDetails(meetingId);
                return botDetails;
            }
            
            const mockMeetings = this.getMockMeetings();
            return mockMeetings.find(m => m.id === meetingId) || mockMeetings[0];
        } catch (error) {
            console.error('Error fetching meeting details:', error);
            const mockMeetings = this.getMockMeetings();
            return mockMeetings[0];
        }
    }

    // Get meeting transcript (legacy compatibility)
    async getMeetingTranscript(meetingId) {
        return this.getMeetingTranscriptWithFallback(meetingId);
    }
}

export default MeetStreamAPI;