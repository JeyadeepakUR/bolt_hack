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

    // Get user account information (this might give us access to user's bots)
    async getUserAccount() {
        try {
            const url = `${this.baseURL}/api/v1/user/account`;
            console.log(`Fetching user account from URL: ${url}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            const data = await this.handleResponse(response, 'fetch user account');
            return data;
        } catch (error) {
            console.error('Error fetching user account:', error);
            throw error;
        }
    }

    // Get user's bots/meetings using a different approach
    async getUserBots() {
        try {
            console.log('Attempting to fetch user bots...');
            
            // Try different potential endpoints that might list user's bots
            const possibleEndpoints = [
                '/api/v1/bots',
                '/api/v1/user/bots',
                '/api/v1/meetings',
                '/api/v1/user/meetings'
            ];

            for (const endpoint of possibleEndpoints) {
                try {
                    const url = `${this.baseURL}${endpoint}`;
                    console.log(`Trying endpoint: ${url}`);
                    
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: this.getHeaders(),
                    });

                    if (response.ok) {
                        const data = await this.handleResponse(response, `fetch from ${endpoint}`);
                        console.log(`Success with endpoint ${endpoint}:`, data);
                        
                        // Process the response based on its structure
                        if (Array.isArray(data)) {
                            return data;
                        } else if (data.bots && Array.isArray(data.bots)) {
                            return data.bots;
                        } else if (data.meetings && Array.isArray(data.meetings)) {
                            return data.meetings;
                        } else if (data.results && Array.isArray(data.results)) {
                            return data.results;
                        } else {
                            console.log('Unexpected data structure:', data);
                            return [data]; // Wrap single object in array
                        }
                    }
                } catch (error) {
                    console.log(`Endpoint ${endpoint} failed:`, error.message);
                    continue;
                }
            }

            // If no endpoints work, try to get user account info
            try {
                const accountData = await this.getUserAccount();
                console.log('User account data:', accountData);
                
                if (accountData.bots) {
                    return accountData.bots;
                } else if (accountData.meetings) {
                    return accountData.meetings;
                }
            } catch (error) {
                console.log('User account endpoint also failed:', error.message);
            }

            console.log('No working endpoints found, using demo data');
            return [];
        } catch (error) {
            console.error('Error fetching user bots:', error);
            return [];
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

    // Fetch real user bots with enhanced discovery
    async fetchRealUserBots() {
        try {
            console.log('Attempting to fetch real user bots with enhanced discovery...');
            
            // First, try to get the list of user's bots
            const userBots = await this.getUserBots();
            console.log('Raw user bots data:', userBots);
            
            if (!userBots || userBots.length === 0) {
                console.log('No bots found from user endpoints');
                return [];
            }

            // Process each bot to get detailed information
            const processedBots = [];
            for (const bot of userBots) {
                try {
                    const botId = bot.id || bot.bot_id || bot.uuid;
                    if (!botId) {
                        console.warn('Bot missing ID:', bot);
                        continue;
                    }

                    console.log(`Processing bot: ${botId}`);
                    
                    // Get bot status and details
                    let botStatus = null;
                    let botDetails = null;
                    
                    try {
                        botStatus = await this.getBotStatus(botId);
                        console.log(`Bot ${botId} status:`, botStatus);
                    } catch (error) {
                        console.warn(`Could not get status for bot ${botId}:`, error.message);
                    }
                    
                    try {
                        botDetails = await this.getBotDetails(botId);
                        console.log(`Bot ${botId} details:`, botDetails);
                    } catch (error) {
                        console.warn(`Could not get details for bot ${botId}:`, error.message);
                    }

                    // Combine all the information
                    const processedBot = {
                        id: botId,
                        ...bot, // Original bot data
                        status: botStatus?.status || bot.status || 'unknown',
                        details: botDetails || {},
                        isReal: true,
                        // Normalize common fields
                        bot_name: botDetails?.bot_name || bot.bot_name || bot.name || `Bot ${botId}`,
                        created_at: botDetails?.created_at || bot.created_at || bot.start_time,
                        transcript_id: botDetails?.transcript_id || bot.transcript_id,
                        meeting_link: botDetails?.meeting_link || bot.meeting_link || bot.join_url,
                        participants: botDetails?.participants || bot.participants || []
                    };

                    processedBots.push(processedBot);
                } catch (error) {
                    console.error('Error processing bot:', error);
                }
            }

            console.log(`Successfully processed ${processedBots.length} real bots`);
            return processedBots;
        } catch (error) {
            console.error('Error fetching real user bots:', error);
            return [];
        }
    }

    // Get recent meetings (completed bots)
    async getRecentMeetings(count = 15) {
        try {
            console.log('Fetching recent meetings (completed bots)...');
            const userBots = await this.fetchRealUserBots();
            
            if (userBots.length === 0) {
                console.log('No real bots found, using demo data');
                return this.getMockMeetings().slice(0, count);
            }

            // Filter for completed bots and sort by date
            const completedBots = userBots
                .filter(bot => {
                    const status = bot.status || 'unknown';
                    return status === 'completed' || status === 'finished' || status === 'ended';
                })
                .sort((a, b) => {
                    const dateA = new Date(a.created_at || a.start_time || 0);
                    const dateB = new Date(b.created_at || b.start_time || 0);
                    return dateB - dateA; // Most recent first
                })
                .slice(0, count);

            console.log(`Found ${completedBots.length} completed bots`);
            
            // If no completed bots, show all bots
            if (completedBots.length === 0) {
                console.log('No completed bots found, showing all bots');
                return userBots.slice(0, count);
            }

            return completedBots;
        } catch (error) {
            console.error('Error fetching recent meetings:', error);
            return this.getMockMeetings().slice(0, count);
        }
    }

    // Get live meetings (active bots)
    async getLiveMeetings() {
        try {
            console.log('Fetching live meetings (active bots)...');
            const userBots = await this.fetchRealUserBots();
            
            if (userBots.length === 0) {
                console.log('No real bots found, using demo data');
                return this.getMockLiveMeetings();
            }

            // Filter for live/active bots
            const liveBots = userBots.filter(bot => {
                const status = bot.status || 'unknown';
                return status === 'active' || status === 'live' || status === 'running' || status === 'in_progress';
            });

            console.log(`Found ${liveBots.length} live bots`);
            return liveBots;
        } catch (error) {
            console.error('Error fetching live meetings:', error);
            return this.getMockLiveMeetings();
        }
    }

    // Search meetings/bots
    async searchMeetings(query) {
        try {
            console.log('Searching meetings for:', query);
            const allBots = await this.fetchRealUserBots();
            
            if (allBots.length === 0) {
                console.log('No real bots found, searching demo data');
                const mockMeetings = this.getMockMeetings();
                const filteredMeetings = mockMeetings.filter(meeting => 
                    meeting.title.toLowerCase().includes(query.toLowerCase()) ||
                    meeting.participants.some(p => 
                        (typeof p === 'string' ? p : p.name || p.email || '').toLowerCase().includes(query.toLowerCase())
                    )
                );
                return { meetings: filteredMeetings };
            }

            const filteredBots = allBots.filter(bot => {
                const title = bot.bot_name || bot.name || '';
                const participants = bot.participants || [];
                
                return title.toLowerCase().includes(query.toLowerCase()) ||
                       participants.some(p => 
                           (typeof p === 'string' ? p : p.name || p.email || '').toLowerCase().includes(query.toLowerCase())
                       );
            });
            
            console.log(`Search found ${filteredBots.length} matching bots`);
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
            if (meetingId.startsWith('bot_') && !meetingId.includes('demo')) {
                try {
                    // First get bot details to find transcript ID
                    const botDetails = await this.getBotDetails(meetingId);
                    console.log('Bot details:', botDetails);
                    
                    if (botDetails && botDetails.transcript_id) {
                        console.log('Found transcript ID:', botDetails.transcript_id);
                        const transcript = await this.getTranscript(botDetails.transcript_id);
                        console.log('Real transcript fetched:', transcript);
                        return transcript;
                    } else {
                        console.warn('No transcript ID found in bot details');
                    }
                } catch (e) {
                    console.warn('Could not get bot details or transcript:', e);
                }
            }
            
            // If this looks like a transcript ID, use it directly
            if (meetingId.startsWith('transcript_') && !meetingId.includes('demo')) {
                const transcriptId = meetingId.replace('transcript_', '');
                console.log('Fetching transcript directly with ID:', transcriptId);
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

    // Get mock meetings for fallback
    getMockMeetings() {
        return [
            {
                id: 'bot_demo_001',
                title: 'Weekly Team Standup (Demo)',
                start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                duration: 1800,
                participants: [
                    { name: 'Alice Johnson', email: 'alice@company.com' },
                    { name: 'Bob Smith', email: 'bob@company.com' },
                    { name: 'Carol Davis', email: 'carol@company.com' }
                ],
                status: 'completed',
                bot_name: 'weekly-standup-bot',
                transcript_id: 'transcript_demo_001',
                isReal: false
            },
            {
                id: 'bot_demo_002',
                title: 'Product Strategy Review (Demo)',
                start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                duration: 3600,
                participants: [
                    { name: 'David Wilson', email: 'david@company.com' },
                    { name: 'Emma Brown', email: 'emma@company.com' },
                    { name: 'Frank Miller', email: 'frank@company.com' }
                ],
                status: 'completed',
                bot_name: 'strategy-bot',
                transcript_id: 'transcript_demo_002',
                isReal: false
            }
        ];
    }

    // Get mock live meetings
    getMockLiveMeetings() {
        return [
            {
                id: 'bot_live_demo_001',
                title: 'Daily Standup - Live (Demo)',
                start_time: new Date().toISOString(),
                status: 'live',
                participants: [
                    { name: 'Alice Johnson', email: 'alice@company.com' },
                    { name: 'Bob Smith', email: 'bob@company.com' }
                ],
                bot_name: 'standup-bot',
                meeting_link: 'https://zoom.us/j/987654321',
                isReal: false
            }
        ];
    }

    // Get mock transcript
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

    // Legacy methods for backward compatibility
    async listMeetings(limit = 10, offset = 0) {
        try {
            const meetings = await this.getRecentMeetings(limit);
            return { meetings };
        } catch (error) {
            console.error('Error listing meetings:', error);
            return { meetings: this.getMockMeetings() };
        }
    }

    async getMeetingDetails(meetingId) {
        try {
            if (meetingId.startsWith('bot_') && !meetingId.includes('demo')) {
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

    async getMeetingTranscript(meetingId) {
        return this.getMeetingTranscriptWithFallback(meetingId);
    }
}

export default MeetStreamAPI;