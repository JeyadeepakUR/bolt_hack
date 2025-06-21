# MeetStream API Integration

This application now includes integration with the MeetStream API to automatically fetch meeting transcripts for idea extraction.

## Features

- **Automatic Transcript Fetching**: Connect to your MeetStream account to fetch meeting transcripts
- **Meeting Search**: Search through your meetings by title or participants
- **Recent Meetings**: Quick access to your most recent meetings
- **Seamless Integration**: Toggle between manual upload and MeetStream API

## Setup

### 1. API Key Configuration

The MeetStream API key is configured in `src/config/api.js`. You can either:

**Option A: Use the provided key (for development)**
```javascript
API_KEY: 'ms_QwsHGaTmjVEvUiiwdNWzdI03LifdoN63'
```

**Option B: Use environment variable (recommended for production)**
Create a `.env` file in your project root:
```env
REACT_APP_MEETSTREAM_API_KEY=your_api_key_here
```

### 2. API Endpoints

The integration uses the following MeetStream API endpoints:
- `GET /meetings` - List all meetings
- `GET /meetings/{id}` - Get meeting details
- `GET /meetings/{id}/transcript` - Get meeting transcript
- `GET /meetings/search` - Search meetings

## Usage

### 1. Toggle to MeetStream Mode

In the Transcript Upload component, use the toggle switch to switch from "Manual Upload" to "MeetStream API".

### 2. Select a Meeting

- **Recent Meetings**: View your most recent meetings automatically loaded
- **Search**: Use the search bar to find specific meetings by title or participants
- **Meeting Details**: Each meeting shows:
  - Meeting title
  - Date and time
  - Duration
  - Number of participants

### 3. Load Transcript

Click on any meeting to automatically fetch and load its transcript. The transcript will be formatted and ready for idea extraction.

## Components

### MeetingSelector
Located in `src/components/MeetingSelector.js`
- Handles meeting listing and search
- Manages API calls to MeetStream
- Provides loading states and error handling

### MeetStreamAPI Service
Located in `src/services/meetstreamApi.js`
- Centralized API client for MeetStream
- Handles authentication and request formatting
- Provides utility methods for transcript formatting

## Error Handling

The integration includes comprehensive error handling:
- API connection errors
- Invalid meeting IDs
- Network timeouts
- Authentication failures

Error messages are displayed to users with actionable feedback.

## Security Considerations

- API keys are stored in configuration files (not in client-side code for production)
- All API requests use HTTPS
- Error messages don't expose sensitive information
- Environment variables are used for production deployments

## Troubleshooting

### Common Issues

1. **"Failed to load recent meetings"**
   - Check your API key is correct
   - Verify your MeetStream account has meetings
   - Check network connectivity

2. **"Failed to load transcript"**
   - Ensure the meeting has a transcript available
   - Check if the meeting ID is valid
   - Verify API permissions

3. **Search not working**
   - Ensure search query is not empty
   - Check API rate limits
   - Verify search endpoint is accessible

### Debug Mode

Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('debug', 'meetstream:*');
```

## API Response Format

The MeetStream API returns transcripts in the following format:
```json
{
  "segments": [
    {
      "speaker": "John Doe",
      "text": "What if we gamify user onboarding?",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  ]
}
```

The integration automatically formats this into the expected transcript format for idea extraction.

## Future Enhancements

- Real-time transcript updates
- Meeting scheduling integration
- Participant analysis
- Meeting analytics dashboard
- Bulk transcript processing 