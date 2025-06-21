import React, { useState, useEffect } from 'react';
import { Brain, Users, TrendingUp, Target, Eye, Heart, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const CognitiveStyleTagging = ({ ideaDatabase, teamMembers }) => {
    const [cognitiveAnalysis, setCognitiveAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedStyle, setSelectedStyle] = useState('all');

    // Cognitive styles with descriptions and icons
    const cognitiveStyles = {
        analytical: {
            name: 'Analytical',
            icon: BarChart3,
            color: 'text-blue-600 bg-blue-100 border-blue-200',
            description: 'Logical, data-driven thinking focused on facts and systematic analysis',
            keywords: ['data', 'analysis', 'metrics', 'logic', 'systematic', 'evidence']
        },
        visual: {
            name: 'Visual',
            icon: Eye,
            color: 'text-purple-600 bg-purple-100 border-purple-200',
            description: 'Spatial and visual thinking, focusing on patterns and visual relationships',
            keywords: ['visual', 'design', 'patterns', 'layout', 'interface', 'graphics']
        },
        emotional: {
            name: 'Emotional',
            icon: Heart,
            color: 'text-pink-600 bg-pink-100 border-pink-200',
            description: 'Empathy-driven thinking focused on user feelings and human connection',
            keywords: ['user', 'feelings', 'empathy', 'connection', 'experience', 'emotion']
        },
        strategic: {
            name: 'Strategic',
            icon: Target,
            color: 'text-green-600 bg-green-100 border-green-200',
            description: 'Big-picture thinking focused on long-term goals and competitive advantage',
            keywords: ['strategy', 'goals', 'competitive', 'market', 'vision', 'planning']
        },
        intuitive: {
            name: 'Intuitive',
            icon: Zap,
            color: 'text-orange-600 bg-orange-100 border-orange-200',
            description: 'Gut-feel thinking based on experience and pattern recognition',
            keywords: ['intuition', 'experience', 'instinct', 'creative', 'innovation', 'breakthrough']
        },
        systematic: {
            name: 'Systematic',
            icon: TrendingUp,
            color: 'text-indigo-600 bg-indigo-100 border-indigo-200',
            description: 'Process-oriented thinking focused on workflows and systematic approaches',
            keywords: ['process', 'workflow', 'system', 'methodology', 'efficiency', 'optimization']
        }
    };

    // Mock team members data
    const mockTeamMembers = [
        { id: 1, name: 'Alice Johnson', role: 'Product Manager', dominantStyle: 'strategic', styles: { strategic: 0.8, analytical: 0.6, systematic: 0.4 } },
        { id: 2, name: 'Bob Chen', role: 'UX Designer', dominantStyle: 'visual', styles: { visual: 0.9, emotional: 0.7, intuitive: 0.5 } },
        { id: 3, name: 'Charlie Davis', role: 'Data Scientist', dominantStyle: 'analytical', styles: { analytical: 0.9, systematic: 0.8, strategic: 0.3 } },
        { id: 4, name: 'Diana Rodriguez', role: 'Frontend Developer', dominantStyle: 'systematic', styles: { systematic: 0.8, analytical: 0.6, visual: 0.4 } },
        { id: 5, name: 'Eve Thompson', role: 'Marketing Specialist', dominantStyle: 'emotional', styles: { emotional: 0.8, intuitive: 0.6, visual: 0.5 } }
    ];

    // Mock idea analysis results
    const mockIdeaAnalysis = [
        {
            id: 1,
            title: "Gamify user onboarding using Duolingo-style feedback loops",
            styles: { analytical: 0.7, systematic: 0.6, emotional: 0.4 },
            dominantStyle: 'analytical',
            confidence: 0.85
        },
        {
            id: 2,
            title: "AI-powered adaptive learning paths based on user interaction speed",
            styles: { analytical: 0.8, systematic: 0.7, strategic: 0.5 },
            dominantStyle: 'analytical',
            confidence: 0.92
        },
        {
            id: 3,
            title: "Voice interface integration for accessibility in onboarding",
            styles: { emotional: 0.8, intuitive: 0.6, visual: 0.4 },
            dominantStyle: 'emotional',
            confidence: 0.78
        },
        {
            id: 4,
            title: "Community-driven progress sharing for user engagement",
            styles: { emotional: 0.9, visual: 0.6, strategic: 0.5 },
            dominantStyle: 'emotional',
            confidence: 0.88
        },
        {
            id: 5,
            title: "Real-time user behavior analysis for UX optimization",
            styles: { analytical: 0.9, systematic: 0.8, strategic: 0.4 },
            dominantStyle: 'analytical',
            confidence: 0.95
        }
    ];

    const performCognitiveAnalysis = async () => {
        setIsAnalyzing(true);

        // Simulate NLP analysis
        await new Promise(resolve => setTimeout(resolve, 2500));

        const analysis = {
            ideas: mockIdeaAnalysis,
            teamDiversity: calculateTeamDiversity(),
            recommendations: generateRecommendations(),
            styleDistribution: calculateStyleDistribution()
        };

        setCognitiveAnalysis(analysis);
        setIsAnalyzing(false);
    };

    const calculateTeamDiversity = () => {
        const styleCounts = {};
        mockTeamMembers.forEach(member => {
            const style = member.dominantStyle;
            styleCounts[style] = (styleCounts[style] || 0) + 1;
        });

        const uniqueStyles = Object.keys(styleCounts).length;
        const totalMembers = mockTeamMembers.length;

        return {
            score: uniqueStyles / totalMembers,
            uniqueStyles,
            totalMembers,
            distribution: styleCounts
        };
    };

    const calculateStyleDistribution = () => {
        const distribution = {};
        Object.keys(cognitiveStyles).forEach(style => {
            distribution[style] = mockIdeaAnalysis.filter(idea => idea.dominantStyle === style).length;
        });
        return distribution;
    };

    const generateRecommendations = () => {
        const teamDiversity = calculateTeamDiversity();
        const styleDistribution = calculateStyleDistribution();
        const recommendations = [];

        // Check for missing cognitive styles in team
        Object.keys(cognitiveStyles).forEach(style => {
            if (!teamDiversity.distribution[style]) {
                recommendations.push({
                    type: 'team',
                    priority: 'high',
                    message: `Consider adding a team member with ${cognitiveStyles[style].name} thinking style`,
                    style: style
                });
            }
        });

        // Check for missing styles in ideas
        Object.keys(cognitiveStyles).forEach(style => {
            if (styleDistribution[style] === 0) {
                recommendations.push({
                    type: 'ideas',
                    priority: 'medium',
                    message: `Generate more ideas with ${cognitiveStyles[style].name} thinking approach`,
                    style: style
                });
            }
        });

        return recommendations;
    };

    const getStyleIcon = (style) => {
        const Icon = cognitiveStyles[style]?.icon || Brain;
        return <Icon className="w-4 h-4" />;
    };

    const getDiversityColor = (score) => {
        if (score >= 0.8) return 'text-green-600 bg-green-100 border-green-200';
        if (score >= 0.6) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
        return 'text-red-600 bg-red-100 border-red-200';
    };

    useEffect(() => {
        if (ideaDatabase.length > 0) {
            performCognitiveAnalysis();
        }
    }, [ideaDatabase]);

    return (
        <motion.div
            className="glass rounded-2xl shadow-professional-lg p-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4">
                        <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Cognitive Style Analysis</h3>
                        <p className="text-gray-600">AI-powered thinking pattern detection</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                        {cognitiveAnalysis ? Math.round(cognitiveAnalysis.teamDiversity.score * 100) : 0}%
                    </div>
                    <div className="text-sm text-gray-500">Team Diversity</div>
                </div>
            </div>

            {/* Analysis Status */}
            {isAnalyzing && (
                <motion.div
                    className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="flex items-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-3"
                        >
                            <Brain className="w-5 h-5 text-blue-600" />
                        </motion.div>
                        <span className="text-blue-800 font-medium">Analyzing cognitive patterns...</span>
                    </div>
                </motion.div>
            )}

            {cognitiveAnalysis && (
                <>
                    {/* Team Diversity Score */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Team Cognitive Diversity</h4>
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <Users className="w-5 h-5 text-gray-600" />
                                    <span className="font-medium text-gray-900">Diversity Score</span>
                                </div>
                                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getDiversityColor(cognitiveAnalysis.teamDiversity.score)}`}>
                                    {Math.round(cognitiveAnalysis.teamDiversity.score * 100)}%
                                </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-indigo-600">
                                        {cognitiveAnalysis.teamDiversity.uniqueStyles}
                                    </div>
                                    <div className="text-sm text-gray-600">Unique Styles</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {cognitiveAnalysis.teamDiversity.totalMembers}
                                    </div>
                                    <div className="text-sm text-gray-600">Team Members</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {Object.keys(cognitiveStyles).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Styles</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Style Distribution */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Cognitive Style Distribution</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(cognitiveStyles).map(([key, style]) => {
                                const Icon = style.icon;
                                const count = cognitiveAnalysis.styleDistribution[key] || 0;
                                const teamCount = cognitiveAnalysis.teamDiversity.distribution[key] || 0;

                                return (
                                    <motion.div
                                        key={key}
                                        className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center mb-3">
                                            <div className={`p-2 rounded-lg ${style.color.split(' ').slice(1).join(' ')}`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div className="ml-3">
                                                <h5 className="font-medium text-gray-900">{style.name}</h5>
                                                <p className="text-xs text-gray-500">{count} ideas, {teamCount} members</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span>Ideas</span>
                                                <span className="font-medium">{count}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <motion.div
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(count / Math.max(...Object.values(cognitiveAnalysis.styleDistribution))) * 100}%` }}
                                                    transition={{ duration: 1, delay: 0.2 }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h4>
                        <div className="space-y-3">
                            {cognitiveAnalysis.recommendations.map((rec, index) => (
                                <motion.div
                                    key={index}
                                    className={`p-4 rounded-lg border ${rec.priority === 'high'
                                        ? 'bg-red-50 border-red-200'
                                        : 'bg-yellow-50 border-yellow-200'
                                        }`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-start">
                                        <div className={`p-2 rounded-lg ${rec.priority === 'high'
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-yellow-100 text-yellow-600'
                                            }`}>
                                            {rec.type === 'team' ? <Users className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <p className="text-sm font-medium text-gray-900">{rec.message}</p>
                                            <div className="flex items-center mt-2">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${cognitiveStyles[rec.style]?.color}`}>
                                                    {getStyleIcon(rec.style)}
                                                    <span className="ml-1">{cognitiveStyles[rec.style]?.name}</span>
                                                </span>
                                                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${rec.priority === 'high'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {rec.priority} priority
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Team Members Analysis */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Team Cognitive Profiles</h4>
                        <div className="space-y-3">
                            {mockTeamMembers.map((member, index) => (
                                <motion.div
                                    key={member.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h5 className="font-medium text-gray-900">{member.name}</h5>
                                            <p className="text-sm text-gray-500">{member.role}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${cognitiveStyles[member.dominantStyle]?.color}`}>
                                            {getStyleIcon(member.dominantStyle)}
                                            <span className="ml-1">{cognitiveStyles[member.dominantStyle]?.name}</span>
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {Object.entries(member.styles).map(([style, score]) => (
                                            <div key={style} className="flex items-center justify-between">
                                                <span className="text-xs text-gray-600">{cognitiveStyles[style]?.name}</span>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-16 bg-gray-200 rounded-full h-1">
                                                        <div
                                                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1 rounded-full"
                                                            style={{ width: `${score * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-gray-500">{Math.round(score * 100)}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </motion.div>
    );
};

export default CognitiveStyleTagging; 