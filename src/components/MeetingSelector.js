import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, Clock, Download, Loader2, Wifi, WifiOff, Bot, Mic, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import MeetStreamAPI from '../services/meetstreamApi';

const MeetingSelector = ({ onTranscriptLoaded, onLoadingChange }) => {
    const [meetings, setMeetings] = useState([]);
    const [liveMeetings, setLiveMeetings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('recent');
    const [connectionStatus, setConnectionStatus] = useState('checking');

    const meetstreamAPI = new MeetStreamAPI();

    // Load meetings and check connection on component mount
    useEffect(() => {
        checkConnectionAndLoadData();
    }, []);

    const checkConnectionAndLoadData = async () => {
        setConnectionStatus('checking');
        try {
            // Try to make a simple API call to check connection
            await loadRecentMeetings();
            await loadLiveMeetings();
            setConnectionStatus('connected');
        } catch (error) {
            console.error('Connection check failed:', error);
            setConnectionStatus('disconnected');
        }
    };

    const loadRecentMeetings = async () => {
        setIsLoadingMeetings(true);
        setError('');
        try {
            console.log('Loading recent meetings (completed bots)...');
            const recentMeetings = await meetstreamAPI.getRecentMeetings(15);
            console.log('Recent meetings loaded:', recentMeetings);
            setMeetings(recentMeetings);
        } catch (err) {
            console.error('Error loading recent meetings:', err);
            setError('Failed to load recent meetings. Using demo data.');
            // Load mock data as fallback
            setMeetings(meetstreamAPI.getMockMeetings());
        } finally {
            setIsLoadingMeetings(false);
        }
    };

    const loadLiveMeetings = async () => {
        try {
            console.log('Loading live meetings (active bots)...');
            const live = await meetstreamAPI.getLiveMeetings();
            console.log('Live meetings loaded:', live);
            setLiveMeetings(live);
        } catch (err) {
            console.error('Error loading live meetings:', err);
            setLiveMeetings([]);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            loadRecentMeetings();
            return;
        }

        setIsLoadingMeetings(true);
        setError('');
        try {
            console.log('Searching meetings for:', searchQuery);
            const searchResults = await meetstreamAPI.searchMeetings(searchQuery);
            console.log('Search results:', searchResults);
            setMeetings(searchResults.meetings || []);
        } catch (err) {
            console.error('Error searching meetings:', err);
            setError('Failed to search meetings. Please try again.');
        } finally {
            setIsLoadingMeetings(false);
        }
    };

    const handleMeetingSelect = async (meeting) => {
        setSelectedMeeting(meeting);
        setIsLoading(true);
        onLoadingChange(true);
        setError('');

        try {
            console.log('Loading transcript for meeting:', meeting.id);
            
            // Check if this is a real bot or demo data
            if (meeting.isReal === false) {
                console.log('Using demo transcript for demo meeting');
                const mockTranscript = meetstreamAPI.getMockTranscript();
                const formattedTranscript = meetstreamAPI.formatTranscriptText(mockTranscript);
                onTranscriptLoaded(formattedTranscript, meeting.title || meeting.bot_name || 'Demo Meeting');
            } else {
                // Try to get real transcript
                console.log('Attempting to fetch real transcript...');
                const transcriptData = await meetstreamAPI.getMeetingTranscriptWithFallback(meeting.id);
                console.log('Transcript data received:', transcriptData);
                
                const formattedTranscript = meetstreamAPI.formatTranscriptText(transcriptData);
                console.log('Formatted transcript:', formattedTranscript);
                
                if (!formattedTranscript.trim()) {
                    throw new Error('No transcript content available for this meeting');
                }
                
                onTranscriptLoaded(formattedTranscript, meeting.title || meeting.bot_name || 'Meeting Transcript');
            }
        } catch (err) {
            console.error('Error loading transcript:', err);
            setError(`Failed to load transcript: ${err.message}`);
        } finally {
            setIsLoading(false);
            onLoadingChange(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Unknown date';
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return 'Unknown duration';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getMeetingStatus = (meeting) => {
        const status = meeting.status || 'unknown';
        
        if (status === 'live' || status === 'active') {
            return { label: 'Live', color: 'bg-red-100 text-red-700', icon: Wifi };
        } else if (status === 'completed' || status === 'finished') {
            return { label: 'Completed', color: 'bg-green-100 text-green-700', icon: Bot };
        } else {
            return { label: 'Unknown', color: 'bg-gray-100 text-gray-700', icon: WifiOff };
        }
    };

    const getConnectionStatusDisplay = () => {
        switch (connectionStatus) {
            case 'checking':
                return { color: 'text-yellow-600', icon: Loader2, label: 'Checking connection...', spinning: true };
            case 'connected':
                return { color: 'text-green-600', icon: Wifi, label: 'Connected to MeetStream API', spinning: false };
            case 'disconnected':
                return { color: 'text-red-600', icon: WifiOff, label: 'Using demo data (API unavailable)', spinning: false };
            default:
                return { color: 'text-gray-600', icon: AlertCircle, label: 'Unknown status', spinning: false };
        }
    };

    const currentMeetings = activeTab === 'live' ? liveMeetings : meetings;
    const connectionDisplay = getConnectionStatusDisplay();
    const ConnectionIcon = connectionDisplay.icon;

    return (
        <motion.div
            className="glass rounded-2xl shadow-professional-lg p-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mr-4">
                    <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Select Meeting</h2>
                    <p className="text-gray-600">Choose a meeting from your MeetStream account</p>
                </div>
            </div>

            {/* Connection Status */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ConnectionIcon 
                            className={`w-4 h-4 mr-2 ${connectionDisplay.color} ${connectionDisplay.spinning ? 'animate-spin' : ''}`} 
                        />
                        <span className={`text-sm ${connectionDisplay.color}`}>
                            {connectionDisplay.label}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-blue-800 text-sm">
                            API Key: {meetstreamAPI.apiKey ? `${meetstreamAPI.apiKey.substring(0, 8)}...` : 'Not configured'}
                        </span>
                        <button
                            onClick={checkConnectionAndLoadData}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Refresh connection"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => setActiveTab('recent')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === 'recent'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Bot className="w-4 h-4 inline mr-2" />
                    Recent Bots ({meetings.length})
                </button>
                <button
                    onClick={() => setActiveTab('live')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                        activeTab === 'live'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    <Wifi className="w-4 h-4 inline mr-2" />
                    Live Bots ({liveMeetings.length})
                </button>
            </div>

            {/* Search bar - only show for recent meetings */}
            {activeTab === 'recent' && (
                <div className="mb-6">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Search bots by name or participants..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                            />
                        </div>
                        <motion.button
                            onClick={handleSearch}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Search
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <motion.div
                    className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        {error}
                    </div>
                </motion.div>
            )}

            {/* Meetings list */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {isLoadingMeetings ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
                        <span className="text-gray-600">Loading {activeTab === 'live' ? 'live bots' : 'recent bots'}...</span>
                    </div>
                ) : currentMeetings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">
                            {activeTab === 'live' ? 'No live bots found' : 'No recent bots found'}
                        </p>
                        <p className="text-sm">
                            {activeTab === 'live' 
                                ? 'Start a meeting with a MeetStream bot to see it here' 
                                : 'Your completed meeting bots will appear here'
                            }
                        </p>
                    </div>
                ) : (
                    currentMeetings.map((meeting) => {
                        const status = getMeetingStatus(meeting);
                        const StatusIcon = status.icon;
                        const isDemo = meeting.isReal === false;
                        
                        return (
                            <motion.div
                                key={meeting.id}
                                className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                    selectedMeeting?.id === meeting.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                } ${isDemo ? 'border-l-4 border-l-orange-400' : ''}`}
                                onClick={() => handleMeetingSelect(meeting)}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-semibold text-gray-900">
                                                {meeting.title || meeting.bot_name || 'Untitled Meeting'}
                                            </h4>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                                                <StatusIcon className="w-3 h-3 inline mr-1" />
                                                {status.label}
                                            </span>
                                            {isDemo && (
                                                <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
                                                    Demo Data
                                                </span>
                                            )}
                                            {meeting.bot_name && (
                                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                                                    <Bot className="w-3 h-3 inline mr-1" />
                                                    {meeting.bot_name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(meeting.start_time || meeting.created_at)}
                                            </div>
                                            {meeting.duration && (
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {formatDuration(meeting.duration)}
                                                </div>
                                            )}
                                            {meeting.participants && (
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1" />
                                                    {Array.isArray(meeting.participants) ? meeting.participants.length : 0} participants
                                                </div>
                                            )}
                                            {meeting.transcript_id && (
                                                <div className="flex items-center">
                                                    <Mic className="w-4 h-4 mr-1" />
                                                    Transcript available
                                                </div>
                                            )}
                                        </div>
                                        {meeting.participants && Array.isArray(meeting.participants) && meeting.participants.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {meeting.participants.slice(0, 3).map((participant, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                                                    >
                                                        {typeof participant === 'string' ? participant : participant.name || participant.email || 'Unknown'}
                                                    </span>
                                                ))}
                                                {meeting.participants.length > 3 && (
                                                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                                                        +{meeting.participants.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                        {meeting.meeting_link && (
                                            <div className="mt-2">
                                                <span className="text-xs text-gray-500">
                                                    Meeting Link: {meeting.meeting_link.substring(0, 50)}...
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {isLoading && selectedMeeting?.id === meeting.id && (
                                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Selected meeting info */}
            {selectedMeeting && !isLoading && (
                <motion.div
                    className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="flex items-center">
                        <Download className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                            <span className="text-green-800 font-medium">
                                Transcript loaded from: {selectedMeeting.title || selectedMeeting.bot_name || 'Untitled Meeting'}
                            </span>
                            <p className="text-green-700 text-sm">
                                Ready to extract ideas from this meeting
                                {selectedMeeting.isReal === false && ' (using demo transcript)'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Refresh button */}
            <div className="mt-6 flex justify-center">
                <motion.button
                    onClick={() => {
                        if (activeTab === 'live') {
                            loadLiveMeetings();
                        } else {
                            loadRecentMeetings();
                        }
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <RefreshCw className="w-4 h-4 inline mr-2" />
                    Refresh {activeTab === 'live' ? 'Live Bots' : 'Recent Bots'}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default MeetingSelector;