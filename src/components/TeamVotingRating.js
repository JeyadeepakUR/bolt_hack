import React, { useState, useEffect } from 'react';
import { Users, Star, Heart, Zap, Lightbulb, TrendingUp, MessageCircle, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TeamVotingRating = ({ generatedIdeas, teamMembers }) => {
    const [votingData, setVotingData] = useState({});
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [activeTab, setActiveTab] = useState('voting');

    // Mock team members
    const mockTeamMembers = [
        { id: 1, name: 'Alice Johnson', avatar: 'AJ', role: 'Product Manager' },
        { id: 2, name: 'Bob Chen', avatar: 'BC', role: 'UX Designer' },
        { id: 3, name: 'Charlie Davis', avatar: 'CD', role: 'Data Scientist' },
        { id: 4, name: 'Diana Rodriguez', avatar: 'DR', role: 'Frontend Developer' },
        { id: 5, name: 'Eve Thompson', avatar: 'ET', role: 'Marketing Specialist' }
    ];

    // Emoji reactions
    const emojiReactions = [
        { emoji: '🚀', name: 'rocket', label: 'Ready to Launch', color: 'bg-blue-100 text-blue-600' },
        { emoji: '💡', name: 'bulb', label: 'Great Idea', color: 'bg-yellow-100 text-yellow-600' },
        { emoji: '❤️', name: 'heart', label: 'Love It', color: 'bg-red-100 text-red-600' },
        { emoji: '🤔', name: 'thinking', label: 'Needs More Thought', color: 'bg-gray-100 text-gray-600' }
    ];

    // Initialize voting data
    useEffect(() => {
        if (generatedIdeas.length > 0) {
            const initialVotingData = {};
            generatedIdeas.forEach(idea => {
                initialVotingData[idea.id] = {
                    emojiReactions: {},
                    starRatings: {},
                    comments: [],
                    totalVotes: 0,
                    averageRating: 0,
                    consensus: 0
                };
            });
            setVotingData(initialVotingData);
        }
    }, [generatedIdeas]);

    const handleEmojiReaction = (ideaId, emojiName) => {
        setVotingData(prev => {
            const ideaData = prev[ideaId] || { emojiReactions: {}, starRatings: {}, comments: [], totalVotes: 0, averageRating: 0, consensus: 0 };
            const currentReactions = ideaData.emojiReactions[emojiName] || [];

            // Simulate user interaction (in real app, this would be the current user)
            const currentUser = mockTeamMembers[0];

            const updatedReactions = currentReactions.includes(currentUser.id)
                ? currentReactions.filter(id => id !== currentUser.id)
                : [...currentReactions, currentUser.id];

            return {
                ...prev,
                [ideaId]: {
                    ...ideaData,
                    emojiReactions: {
                        ...ideaData.emojiReactions,
                        [emojiName]: updatedReactions
                    }
                }
            };
        });
    };

    const handleStarRating = (ideaId, rating) => {
        setVotingData(prev => {
            const ideaData = prev[ideaId] || { emojiReactions: {}, starRatings: {}, comments: [], totalVotes: 0, averageRating: 0, consensus: 0 };
            const currentUser = mockTeamMembers[0];

            const updatedRatings = {
                ...ideaData.starRatings,
                [currentUser.id]: rating
            };

            // Calculate average rating
            const ratings = Object.values(updatedRatings);
            const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

            return {
                ...prev,
                [ideaId]: {
                    ...ideaData,
                    starRatings: updatedRatings,
                    averageRating
                }
            };
        });
    };

    const addComment = (ideaId) => {
        if (!newComment.trim()) return;

        setVotingData(prev => {
            const ideaData = prev[ideaId] || { emojiReactions: {}, starRatings: {}, comments: [], totalVotes: 0, averageRating: 0, consensus: 0 };
            const currentUser = mockTeamMembers[0];

            const newCommentObj = {
                id: Date.now(),
                text: newComment,
                author: currentUser,
                timestamp: new Date().toISOString(),
                likes: []
            };

            return {
                ...prev,
                [ideaId]: {
                    ...ideaData,
                    comments: [...ideaData.comments, newCommentObj]
                }
            };
        });

        setNewComment('');
    };

    const likeComment = (ideaId, commentId) => {
        setVotingData(prev => {
            const ideaData = prev[ideaId];
            const currentUser = mockTeamMembers[0];

            const updatedComments = ideaData.comments.map(comment => {
                if (comment.id === commentId) {
                    const likes = comment.likes.includes(currentUser.id)
                        ? comment.likes.filter(id => id !== currentUser.id)
                        : [...comment.likes, currentUser.id];
                    return { ...comment, likes };
                }
                return comment;
            });

            return {
                ...prev,
                [ideaId]: {
                    ...ideaData,
                    comments: updatedComments
                }
            };
        });
    };

    const calculateConsensus = (ideaId) => {
        const ideaData = votingData[ideaId];
        if (!ideaData) return 0;

        const totalReactions = Object.values(ideaData.emojiReactions).flat().length;
        const totalRatings = Object.keys(ideaData.starRatings).length;
        const totalComments = ideaData.comments.length;

        const totalEngagement = totalReactions + totalRatings + totalComments;
        const maxPossibleEngagement = mockTeamMembers.length * (emojiReactions.length + 1) + mockTeamMembers.length; // +1 for star rating, +1 for comment

        return totalEngagement / maxPossibleEngagement;
    };

    const getTopRatedIdeas = () => {
        return generatedIdeas
            .map(idea => ({
                ...idea,
                votingData: votingData[idea.id] || { averageRating: 0, consensus: 0 }
            }))
            .sort((a, b) => b.votingData.averageRating - a.votingData.averageRating);
    };

    const getMostEngagedIdeas = () => {
        return generatedIdeas
            .map(idea => ({
                ...idea,
                votingData: votingData[idea.id] || { consensus: 0 }
            }))
            .sort((a, b) => b.votingData.consensus - a.votingData.consensus);
    };

    return (
        <motion.div
            className="glass rounded-2xl shadow-professional-lg p-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl mr-4">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Team Voting & Rating</h3>
                        <p className="text-gray-600">Collaborative idea prioritization</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{generatedIdeas.length}</div>
                    <div className="text-sm text-gray-500">Ideas to Vote</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => setActiveTab('voting')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'voting'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <ThumbsUp className="w-4 h-4 inline mr-2" />
                    Voting
                </button>
                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'analytics'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <TrendingUp className="w-4 h-4 inline mr-2" />
                    Analytics
                </button>
            </div>

            {activeTab === 'voting' && (
                <div className="space-y-6">
                    {generatedIdeas.map((idea) => {
                        const ideaVotingData = votingData[idea.id] || { emojiReactions: {}, starRatings: {}, comments: [], averageRating: 0 };

                        return (
                            <motion.div
                                key={idea.id}
                                className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{idea.name}</h4>
                                        <p className="text-gray-700 mb-3">{idea.pitch}</p>
                                    </div>
                                    <div className="ml-4 text-right">
                                        <div className="flex items-center space-x-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() => handleStarRating(idea.id, star)}
                                                    className={`p-1 rounded transition-colors ${ideaVotingData.starRatings[mockTeamMembers[0].id] >= star
                                                        ? 'text-yellow-500'
                                                        : 'text-gray-300 hover:text-yellow-400'
                                                        }`}
                                                >
                                                    <Star className="w-5 h-5 fill-current" />
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {ideaVotingData.averageRating.toFixed(1)} avg rating
                                        </div>
                                    </div>
                                </div>

                                {/* Emoji Reactions */}
                                <div className="flex items-center space-x-4 mb-4">
                                    {emojiReactions.map((reaction) => {
                                        const reactions = ideaVotingData.emojiReactions[reaction.name] || [];
                                        const isReacted = reactions.includes(mockTeamMembers[0].id);

                                        return (
                                            <motion.button
                                                key={reaction.name}
                                                onClick={() => handleEmojiReaction(idea.id, reaction.name)}
                                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all duration-200 ${isReacted
                                                    ? `${reaction.color} border-current`
                                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <span className="text-lg">{reaction.emoji}</span>
                                                <span className="text-sm font-medium">{reactions.length}</span>
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                {/* Comments Section */}
                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="font-medium text-gray-900">Comments ({ideaVotingData.comments.length})</h5>
                                        <button
                                            onClick={() => setShowComments(showComments === idea.id ? null : idea.id)}
                                            className="text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            {showComments === idea.id ? 'Hide' : 'Show'} Comments
                                        </button>
                                    </div>

                                    {showComments === idea.id && (
                                        <AnimatePresence>
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {/* Add Comment */}
                                                <div className="flex space-x-3 mb-4">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                        {mockTeamMembers[0].avatar}
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            value={newComment}
                                                            onChange={(e) => setNewComment(e.target.value)}
                                                            placeholder="Add a comment..."
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            onKeyPress={(e) => e.key === 'Enter' && addComment(idea.id)}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => addComment(idea.id)}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Post
                                                    </button>
                                                </div>

                                                {/* Comments List */}
                                                <div className="space-y-3">
                                                    {ideaVotingData.comments.map((comment) => (
                                                        <motion.div
                                                            key={comment.id}
                                                            className="flex space-x-3"
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                        >
                                                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                                {comment.author.avatar}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="bg-gray-50 rounded-lg p-3">
                                                                    <div className="flex items-center justify-between mb-1">
                                                                        <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {new Date(comment.timestamp).toLocaleDateString()}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-sm text-gray-700">{comment.text}</p>
                                                                </div>
                                                                <div className="flex items-center space-x-4 mt-2">
                                                                    <button
                                                                        onClick={() => likeComment(idea.id, comment.id)}
                                                                        className={`flex items-center space-x-1 text-xs ${comment.likes.includes(mockTeamMembers[0].id)
                                                                            ? 'text-red-600'
                                                                            : 'text-gray-500 hover:text-red-600'
                                                                            }`}
                                                                    >
                                                                        <Heart className="w-3 h-3" />
                                                                        <span>{comment.likes.length}</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    {/* Top Rated Ideas */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Rated Ideas</h4>
                        <div className="space-y-3">
                            {getTopRatedIdeas().slice(0, 3).map((idea, index) => (
                                <motion.div
                                    key={idea.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-gray-900">{idea.name}</h5>
                                            <p className="text-sm text-gray-600">{idea.pitch.substring(0, 100)}...</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center space-x-1 mb-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= idea.votingData.averageRating
                                                            ? 'text-yellow-500 fill-current'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {idea.votingData.averageRating.toFixed(1)}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Engagement Analytics */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Engagement Analytics</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {generatedIdeas.length}
                                </div>
                                <div className="text-sm text-gray-600">Total Ideas</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {Object.values(votingData).reduce((acc, data) => acc + data.comments.length, 0)}
                                </div>
                                <div className="text-sm text-gray-600">Total Comments</div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 text-center">
                                <div className="text-2xl font-bold text-purple-600">
                                    {Math.round(Object.values(votingData).reduce((acc, data) => acc + data.averageRating, 0) / Math.max(generatedIdeas.length, 1) * 10) / 10}
                                </div>
                                <div className="text-sm text-gray-600">Avg Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Team Participation */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Team Participation</h4>
                        <div className="space-y-3">
                            {mockTeamMembers.map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                                            {member.avatar}
                                        </div>
                                        <div>
                                            <h5 className="font-medium text-gray-900">{member.name}</h5>
                                            <p className="text-sm text-gray-500">{member.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-green-600">
                                            {Math.floor(Math.random() * 20) + 10}%
                                        </div>
                                        <div className="text-sm text-gray-500">Participation</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TeamVotingRating; 