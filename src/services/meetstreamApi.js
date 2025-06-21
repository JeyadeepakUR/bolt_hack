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
        };
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

            console.log('Get Transcript API Response Status:', response.status);
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Get Transcript API Error Body:', errorBody);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
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
            const response = await fetch(url, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            console.log('List Meetings API Response Status:', response.status);
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('List Meetings API Error Body:', errorBody);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Data received from listMeetings:', data);
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

            console.log('Search Meetings API Response Status:', response.status);
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Search Meetings API Error Body:', errorBody);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Data received from searchMeetings:', data);
            return data;
        } catch (error) {
            console.error('Error searching meetings:', error);
            throw error;
        }
    }

    // Get meeting details
    async getMeetingDetails(meetingId) {
        try {
            const response = await fetch(`${this.baseURL}/meetings/${meetingId}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
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
            return [];
        }
    }
}

export default MeetStreamAPI; 