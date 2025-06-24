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

    // Get headers for API requests - try different authentication methods
    getHeaders(authType = 'token') {
        const baseHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'DewDrop-AI/1.0'
        };

        switch (authType) {
            case 'token':
                return {
                    ...baseHeaders,
                    'Authorization': `Token ${this.apiKey}`
                };
            case 'bearer':
                return {
                    ...baseHeaders,
                    'Authorization': `Bearer ${this.apiKey}`
                };
            case 'apikey':
                return {
                    ...baseHeaders,
                    'X-API-Key': this.apiKey
                };
            case 'basic':
                return {
                    ...baseHeaders,
                    'Authorization': `Basic ${btoa(this.apiKey + ':')}`
                };
            default:
                return baseHeaders;
        }
    }

    // Handle API response errors with better error parsing
    async handleResponse(response, operation) {
        console.log(`Response for ${operation}:`, {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = `Failed to ${operation}: ${response.status} ${response.statusText}`;
            
            try {
                const errorData = JSON.parse(errorText);
                if (errorData.message) {
                    errorMessage = `${operation} API Error: ${errorData.message}`;
                } else if (errorData.detail) {
                    errorMessage = `${operation} API Error: ${errorData.detail}`;
                } else if (errorData.error) {
                    errorMessage = `${operation} API Error: ${errorData.error}`;
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

    // Test different authentication methods
    async testAuthentication() {
        const authMethods = ['token', 'bearer', 'apikey', 'basic'];
        const testEndpoint = '/api/v1/user/account';
        
        for (const authType of authMethods) {
            try {
                console.log(`Testing authentication method: ${authType}`);
                const url = `${this.baseURL}${testEndpoint}`;
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: this.getHeaders(authType),
                });

                if (response.ok) {
                    console.log(`✅ Authentication successful with method: ${authType}`);
                    const data = await this.handleResponse(response, `test auth ${authType}`);
                    return { authType, data };
                } else {
                    console.log(`❌ Authentication failed with method: ${authType} - ${response.status}`);
                }
            } catch (error) {
                console.log(`❌ Authentication error with method: ${authType} - ${error.message}`);
            }
        }
        
        return null;
    }

    // Comprehensive API discovery
    async discoverAPI() {
        console.log('🔍 Starting comprehensive API discovery...');
        
        // First, test authentication
        const authResult = await this.testAuthentication();
        let workingAuthType = 'token'; // default
        
        if (authResult) {
            workingAuthType = authResult.authType;
            console.log(`✅ Found working authentication: ${workingAuthType}`);
        } else {
            console.log('❌ No working authentication method found, trying with default');
        }

        // Test various endpoint patterns
        const endpointPatterns = [
            // User endpoints
            '/api/v1/user',
            '/api/v1/user/account',
            '/api/v1/user/profile',
            '/api/v1/me',
            
            // Bot endpoints
            '/api/v1/bots',
            '/api/v1/bots/list',
            '/api/v1/user/bots',
            '/api/v1/my/bots',
            
            // Meeting endpoints
            '/api/v1/meetings',
            '/api/v1/meetings/list',
            '/api/v1/user/meetings',
            '/api/v1/my/meetings',
            
            // Session endpoints
            '/api/v1/sessions',
            '/api/v1/user/sessions',
            
            // Transcript endpoints
            '/api/v1/transcripts',
            '/api/v1/user/transcripts',
            
            // Alternative API versions
            '/api/v2/bots',
            '/api/v2/meetings',
            '/v1/bots',
            '/v1/meetings'
        ];

        const results = {};
        
        for (const endpoint of endpointPatterns) {
            try {
                const url = `${this.baseURL}${endpoint}`;
                console.log(`Testing endpoint: ${endpoint}`);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: this.getHeaders(workingAuthType),
                });

                if (response.ok) {
                    try {
                        const data = await this.handleResponse(response, `discover ${endpoint}`);
                        results[endpoint] = { 
                            status: 'success', 
                            data: data,
                            dataType: this.analyzeDataStructure(data)
                        };
                        console.log(`✅ ${endpoint}: Success - ${results[endpoint].dataType}`);
                    } catch (parseError) {
                        results[endpoint] = { 
                            status: 'success_no_parse', 
                            error: parseError.message 
                        };
                        console.log(`⚠️ ${endpoint}: Success but couldn't parse response`);
                    }
                } else {
                    const errorText = await response.text();
                    results[endpoint] = { 
                        status: 'error', 
                        error: `${response.status}: ${errorText}`,
                        statusCode: response.status
                    };
                    console.log(`❌ ${endpoint}: ${response.status} - ${errorText.substring(0, 100)}`);
                }
            } catch (error) {
                results[endpoint] = { 
                    status: 'error', 
                    error: error.message 
                };
                console.log(`❌ ${endpoint}: Network error - ${error.message}`);
            }
        }

        return { authType: workingAuthType, endpoints: results };
    }

    // Analyze data structure to understand what we got
    analyzeDataStructure(data) {
        if (!data) return 'empty';
        
        if (Array.isArray(data)) {
            if (data.length === 0) return 'empty_array';
            const firstItem = data[0];
            if (firstItem.bot_id || firstItem.id) return 'bot_array';
            if (firstItem.meeting_id) return 'meeting_array';
            if (firstItem.transcript_id) return 'transcript_array';
            return `array_of_${typeof firstItem}`;
        }
        
        if (typeof data === 'object') {
            const keys = Object.keys(data);
            if (keys.includes('bots')) return 'object_with_bots';
            if (keys.includes('meetings')) return 'object_with_meetings';
            if (keys.includes('transcripts')) return 'object_with_transcripts';
            if (keys.includes('user')) return 'user_object';
            if (keys.includes('account')) return 'account_object';
            return `object_with_keys_${keys.slice(0, 3).join('_')}`;
        }
        
        return typeof data;
    }

    // Extract bots/meetings from discovered data
    extractBotsFromDiscovery(discoveryResults) {
        const { endpoints } = discoveryResults;
        const allBots = [];
        
        for (const [endpoint, result] of Object.entries(endpoints)) {
            if (result.status === 'success' && result.data) {
                const bots = this.extractBotsFromData(result.data, endpoint);
                if (bots.length > 0) {
                    console.log(`Found ${bots.length} bots from ${endpoint}`);
                    allBots.push(...bots);
                }
            }
        }
        
        // Remove duplicates based on ID
        const uniqueBots = allBots.filter((bot, index, self) => 
            index === self.findIndex(b => (b.id || b.bot_id) === (bot.id || bot.bot_id))
        );
        
        console.log(`Total unique bots found: ${uniqueBots.length}`);
        return uniqueBots;
    }

    // Extract bots from various data structures
    extractBotsFromData(data, source) {
        const bots = [];
        
        if (Array.isArray(data)) {
            // Direct array of bots
            for (const item of data) {
                if (this.looksLikeBot(item)) {
                    bots.push(this.normalizeBot(item, source));
                }
            }
        } else if (typeof data === 'object') {
            // Check for nested arrays
            const possibleArrayKeys = ['bots', 'meetings', 'sessions', 'data', 'results', 'items'];
            for (const key of possibleArrayKeys) {
                if (data[key] && Array.isArray(data[key])) {
                    for (const item of data[key]) {
                        if (this.looksLikeBot(item)) {
                            bots.push(this.normalizeBot(item, source));
                        }
                    }
                }
            }
            
            // Check if the object itself is a bot
            if (this.looksLikeBot(data)) {
                bots.push(this.normalizeBot(data, source));
            }
        }
        
        return bots;
    }

    // Check if an object looks like a bot/meeting
    looksLikeBot(obj) {
        if (!obj || typeof obj !== 'object') return false;
        
        const botIndicators = [
            'bot_id', 'id', 'uuid', 'meeting_id',
            'bot_name', 'name', 'title',
            'status', 'state',
            'created_at', 'start_time', 'timestamp',
            'transcript_id', 'recording_id'
        ];
        
        const hasIndicators = botIndicators.some(indicator => obj.hasOwnProperty(indicator));
        return hasIndicators;
    }

    // Normalize bot data to consistent format
    normalizeBot(bot, source) {
        const id = bot.id || bot.bot_id || bot.uuid || bot.meeting_id || `unknown_${Date.now()}`;
        
        return {
            id: id,
            title: bot.title || bot.name || bot.bot_name || `Meeting ${id}`,
            bot_name: bot.bot_name || bot.name || bot.title || 'Unknown Bot',
            status: bot.status || bot.state || 'unknown',
            created_at: bot.created_at || bot.start_time || bot.timestamp || new Date().toISOString(),
            start_time: bot.start_time || bot.created_at || bot.timestamp,
            duration: bot.duration || bot.length,
            participants: bot.participants || bot.attendees || [],
            transcript_id: bot.transcript_id || bot.recording_id,
            meeting_link: bot.meeting_link || bot.join_url || bot.url,
            isReal: true,
            source: source,
            originalData: bot
        };
    }

    // Main method to get real user bots
    async fetchRealUserBots() {
        try {
            console.log('🚀 Starting comprehensive bot discovery...');
            
            const discoveryResults = await this.discoverAPI();
            console.log('Discovery results:', discoveryResults);
            
            const bots = this.extractBotsFromDiscovery(discoveryResults);
            
            if (bots.length > 0) {
                console.log(`✅ Found ${bots.length} real bots!`);
                
                // Enhance bots with additional details
                const enhancedBots = [];
                for (const bot of bots) {
                    try {
                        const enhancedBot = await this.enhanceBot(bot, discoveryResults.authType);
                        enhancedBots.push(enhancedBot);
                    } catch (error) {
                        console.warn(`Could not enhance bot ${bot.id}:`, error.message);
                        enhancedBots.push(bot);
                    }
                }
                
                return enhancedBots;
            } else {
                console.log('❌ No real bots found in any endpoint');
                return [];
            }
        } catch (error) {
            console.error('Error in fetchRealUserBots:', error);
            return [];
        }
    }

    // Enhance bot with additional details
    async enhanceBot(bot, authType) {
        try {
            // Try to get more details about the bot
            const detailEndpoints = [
                `/api/v1/bots/${bot.id}`,
                `/api/v1/bots/${bot.id}/detail`,
                `/api/v1/bots/${bot.id}/status`,
                `/api/v1/meetings/${bot.id}`,
                `/api/v1/sessions/${bot.id}`
            ];
            
            for (const endpoint of detailEndpoints) {
                try {
                    const url = `${this.baseURL}${endpoint}`;
                    const response = await fetch(url, {
                        method: 'GET',
                        headers: this.getHeaders(authType),
                    });
                    
                    if (response.ok) {
                        const details = await this.handleResponse(response, `enhance bot ${bot.id}`);
                        console.log(`Enhanced bot ${bot.id} with details from ${endpoint}`);
                        return { ...bot, ...details, enhancedFrom: endpoint };
                    }
                } catch (error) {
                    // Continue to next endpoint
                    continue;
                }
            }
            
            return bot;
        } catch (error) {
            console.warn(`Could not enhance bot ${bot.id}:`, error);
            return bot;
        }
    }

    // Get recent meetings (completed bots)
    async getRecentMeetings(count = 15) {
        try {
            console.log('📥 Fetching recent meetings...');
            const userBots = await this.fetchRealUserBots();
            
            if (userBots.length === 0) {
                console.log('No real bots found, using demo data');
                return this.getMockMeetings().slice(0, count);
            }

            // Filter and sort bots
            const recentBots = userBots
                .sort((a, b) => {
                    const dateA = new Date(a.created_at || a.start_time || 0);
                    const dateB = new Date(b.created_at || b.start_time || 0);
                    return dateB - dateA; // Most recent first
                })
                .slice(0, count);

            console.log(`✅ Returning ${recentBots.length} recent bots`);
            return recentBots;
        } catch (error) {
            console.error('Error fetching recent meetings:', error);
            return this.getMockMeetings().slice(0, count);
        }
    }

    // Get live meetings (active bots)
    async getLiveMeetings() {
        try {
            console.log('📡 Fetching live meetings...');
            const userBots = await this.fetchRealUserBots();
            
            if (userBots.length === 0) {
                console.log('No real bots found, using demo data');
                return this.getMockLiveMeetings();
            }

            // Filter for live/active bots
            const liveBots = userBots.filter(bot => {
                const status = (bot.status || '').toLowerCase();
                return ['active', 'live', 'running', 'in_progress', 'ongoing'].includes(status);
            });

            console.log(`✅ Found ${liveBots.length} live bots`);
            return liveBots;
        } catch (error) {
            console.error('Error fetching live meetings:', error);
            return this.getMockLiveMeetings();
        }
    }

    // Search meetings/bots
    async searchMeetings(query) {
        try {
            console.log('🔍 Searching meetings for:', query);
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
                const title = (bot.title || bot.bot_name || '').toLowerCase();
                const participants = bot.participants || [];
                const queryLower = query.toLowerCase();
                
                return title.includes(queryLower) ||
                       participants.some(p => 
                           (typeof p === 'string' ? p : p.name || p.email || '').toLowerCase().includes(queryLower)
                       );
            });
            
            console.log(`✅ Search found ${filteredBots.length} matching bots`);
            return { meetings: filteredBots };
        } catch (error) {
            console.error('Error searching meetings:', error);
            return { meetings: this.getMockMeetings() };
        }
    }

    // Get transcript with enhanced discovery
    async getMeetingTranscriptWithFallback(meetingId) {
        try {
            console.log('📄 Fetching transcript for meeting:', meetingId);
            
            // If this is a real bot, try multiple transcript endpoints
            if (meetingId.startsWith('bot_') && !meetingId.includes('demo')) {
                const transcriptEndpoints = [
                    `/api/v1/bots/${meetingId}/transcript`,
                    `/api/v1/bots/${meetingId}/get_transcript`,
                    `/api/v1/meetings/${meetingId}/transcript`,
                    `/api/v1/sessions/${meetingId}/transcript`,
                    `/api/v1/transcripts/${meetingId}`
                ];
                
                for (const endpoint of transcriptEndpoints) {
                    try {
                        const url = `${this.baseURL}${endpoint}`;
                        console.log(`Trying transcript endpoint: ${endpoint}`);
                        
                        const response = await fetch(url, {
                            method: 'GET',
                            headers: this.getHeaders(),
                        });
                        
                        if (response.ok) {
                            const transcript = await this.handleResponse(response, `fetch transcript from ${endpoint}`);
                            console.log(`✅ Got transcript from ${endpoint}`);
                            return transcript;
                        }
                    } catch (error) {
                        console.log(`❌ Failed to get transcript from ${endpoint}:`, error.message);
                        continue;
                    }
                }
            }
            
            // If this looks like a transcript ID, try direct access
            if (meetingId.startsWith('transcript_') && !meetingId.includes('demo')) {
                const transcriptId = meetingId.replace('transcript_', '');
                try {
                    const transcript = await this.getTranscript(transcriptId);
                    console.log('✅ Got transcript by ID');
                    return transcript;
                } catch (error) {
                    console.log('❌ Failed to get transcript by ID:', error.message);
                }
            }
            
            // Fallback to mock transcript
            console.log('📋 Using mock transcript as fallback');
            return this.getMockTranscript();
        } catch (error) {
            console.warn('Failed to fetch real transcript, using mock data:', error);
            return this.getMockTranscript();
        }
    }

    // Get transcript by ID
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

    // Mock data methods (unchanged)
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
                // Try to get real bot details
                const userBots = await this.fetchRealUserBots();
                const bot = userBots.find(b => b.id === meetingId);
                if (bot) return bot;
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