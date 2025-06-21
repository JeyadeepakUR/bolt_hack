import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, Clock, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import MeetStreamAPI from '../services/meetstreamApi';

const MeetingSelector = ({ onTranscriptLoaded, onLoadingChange }) => {
    const [meetings, setMeetings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [error, setError] = useState('');
    const [showRecent, setShowRecent] = useState(true);

    const meetstreamAPI = new MeetStreamAPI();

    // Load recent meetings on component mount
    useEffect(() => {
        loadRecentMeetings();
    }, []);

    const loadRecentMeetings = async () => {
        setIsLoadingMeetings(true);
        setError('');
        try {
            const recentMeetings = await meetstreamAPI.getRecentMeetings(10);
            setMeetings(recentMeetings);
        } catch (err) {
            setError('Failed to load recent meetings. Please check your API key.');
            console.error('Error loading meetings:', err);
        } finally {
            setIsLoadingMeetings(false);
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
            const searchResults = await meetstreamAPI.searchMeetings(searchQuery);
            setMeetings(searchResults.meetings || []);
            setShowRecent(false);
        } catch (err) {
            setError('Failed to search meetings. Please try again.');
            console.error('Error searching meetings:', err);
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
            const transcriptData = await meetstreamAPI.getMeetingTranscript(meeting.id);
            const formattedTranscript = meetstreamAPI.formatTranscriptText(transcriptData);
            
            onTranscriptLoaded(formattedTranscript, meeting.title || 'Meeting Transcript');
        } catch (err) {
            setError('Failed to load transcript. Please try again.');
            console.error('Error loading transcript:', err);
        } finally {
            setIsLoading(false);
            onLoadingChange(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

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

            {/* Search bar */}
            <div className="mb-6">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search meetings by title or participants..."
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

            {/* Error message */}
            {error && (
                <motion.div
                    className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    {error}
                </motion.div>
            )}

            {/* Recent meetings toggle */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {showRecent ? 'Recent Meetings' : 'Search Results'}
                </h3>
                {!showRecent && (
                    <button
                        onClick={() => {
                            setShowRecent(true);
                            setSearchQuery('');
                            loadRecentMeetings();
                        }}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Show Recent
                    </button>
                )}
            </div>

            {/* Meetings list */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {isLoadingMeetings ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
                        <span className="text-gray-600">Loading meetings...</span>
                    </div>
                ) : meetings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {showRecent ? 'No recent meetings found' : 'No meetings match your search'}
                    </div>
                ) : (
                    meetings.map((meeting) => (
                        <motion.div
                            key={meeting.id}
                            className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                                selectedMeeting?.id === meeting.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handleMeetingSelect(meeting)}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">
                                        {meeting.title || 'Untitled Meeting'}
                                    </h4>
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
                                                {meeting.participants.length} participants
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {isLoading && selectedMeeting?.id === meeting.id && (
                                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                )}
                            </div>
                        </motion.div>
                    ))
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
                                Transcript loaded from: {selectedMeeting.title || 'Untitled Meeting'}
                            </span>
                            <p className="text-green-700 text-sm">
                                Ready to extract ideas from this meeting
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default MeetingSelector; 