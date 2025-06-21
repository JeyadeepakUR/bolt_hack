import React, { useState } from 'react';
import { Clock, TrendingUp, Merge, Rocket, Sprout, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const IdeaEvolutionTimeline = ({ ideaDatabase, currentSessionId }) => {
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [filterStage, setFilterStage] = useState('all');

    // Evolution stages with icons and colors
    const evolutionStages = {
        seed: {
            name: 'Seed',
            icon: Sprout,
            color: 'text-green-600 bg-green-100 border-green-200',
            description: 'Initial concept from brainstorming'
        },
        refined: {
            name: 'Refined',
            icon: TrendingUp,
            color: 'text-blue-600 bg-blue-100 border-blue-200',
            description: 'Enhanced and developed idea'
        },
        merged: {
            name: 'Merged',
            icon: Merge,
            color: 'text-purple-600 bg-purple-100 border-purple-200',
            description: 'Combined with other concepts'
        },
        'ready-to-build': {
            name: 'Ready to Build',
            icon: Rocket,
            color: 'text-orange-600 bg-orange-100 border-orange-200',
            description: 'Ready for implementation'
        }
    };

    // Mock evolution data - in real app this would come from database
    const evolutionData = [
        {
            id: 1,
            ideaId: 1,
            title: "Gamify user onboarding using Duolingo-style feedback loops",
            currentStage: 'refined',
            evolution: [
                {
                    sessionId: 'session-1',
                    sessionName: 'Initial Brainstorming',
                    date: '2024-01-15',
                    stage: 'seed',
                    description: 'Initial concept mentioned in discussion',
                    participants: ['Alice', 'Bob', 'Charlie']
                },
                {
                    sessionId: 'session-2',
                    sessionName: 'UX Deep Dive',
                    date: '2024-01-22',
                    stage: 'refined',
                    description: 'Detailed user flow and feedback mechanisms designed',
                    participants: ['Alice', 'David', 'Eve']
                },
                {
                    sessionId: 'session-3',
                    sessionName: 'Technical Feasibility',
                    date: '2024-01-29',
                    stage: 'ready-to-build',
                    description: 'Technical architecture planned and approved',
                    participants: ['Bob', 'Charlie', 'Frank']
                }
            ]
        },
        {
            id: 2,
            ideaId: 2,
            title: "AI-powered adaptive learning paths",
            currentStage: 'merged',
            evolution: [
                {
                    sessionId: 'session-1',
                    sessionName: 'Initial Brainstorming',
                    date: '2024-01-15',
                    stage: 'seed',
                    description: 'AI recommendation concept introduced',
                    participants: ['Alice', 'Bob', 'Charlie']
                },
                {
                    sessionId: 'session-2',
                    sessionName: 'AI Integration Workshop',
                    date: '2024-01-22',
                    stage: 'refined',
                    description: 'Machine learning models and data requirements defined',
                    participants: ['David', 'Eve', 'Frank']
                },
                {
                    sessionId: 'session-4',
                    sessionName: 'Idea Fusion Session',
                    date: '2024-02-05',
                    stage: 'merged',
                    description: 'Combined with gamification concept for enhanced UX',
                    participants: ['Alice', 'Bob', 'David', 'Eve']
                }
            ]
        }
    ];

    const filteredIdeas = filterStage === 'all'
        ? evolutionData
        : evolutionData.filter(idea => idea.currentStage === filterStage);

    const getStageIcon = (stage) => {
        const Icon = evolutionStages[stage]?.icon || Sprout;
        return <Icon className="w-4 h-4" />;
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
                        <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Idea Evolution Timeline</h3>
                        <p className="text-gray-600">Track idea progression across sessions</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{evolutionData.length}</div>
                    <div className="text-sm text-gray-500">Evolving Ideas</div>
                </div>
            </div>

            {/* Stage Filter */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilterStage('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filterStage === 'all'
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        All Stages
                    </button>
                    {Object.entries(evolutionStages).map(([key, stage]) => (
                        <button
                            key={key}
                            onClick={() => setFilterStage(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${filterStage === key
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {getStageIcon(key)}
                            <span>{stage.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Evolution Timeline */}
            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {filteredIdeas.map((idea) => (
                    <motion.div
                        key={idea.id}
                        className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    {idea.title}
                                </h4>
                                <div className="flex items-center space-x-3">
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${evolutionStages[idea.currentStage].color}`}>
                                        {getStageIcon(idea.currentStage)}
                                        <span className="ml-1">{evolutionStages[idea.currentStage].name}</span>
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {idea.evolution.length} sessions
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div className="space-y-4">
                                {idea.evolution.map((session, index) => (
                                    <motion.div
                                        key={session.sessionId}
                                        className="relative flex items-start space-x-4"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        {/* Timeline dot */}
                                        <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${index === idea.evolution.length - 1
                                            ? 'bg-primary-500 border-primary-500 text-white'
                                            : 'bg-white border-gray-300'
                                            }`}>
                                            {getStageIcon(session.stage)}
                                        </div>

                                        {/* Session content */}
                                        <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <h5 className="font-medium text-gray-900">{session.sessionName}</h5>
                                                <span className="text-xs text-gray-500">{session.date}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 mb-2">{session.description}</p>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs text-gray-500">Participants:</span>
                                                <div className="flex space-x-1">
                                                    {session.participants.map((participant, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                                                        >
                                                            {participant}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Evolution stats */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-lg font-bold text-primary-600">
                                        {idea.evolution.length}
                                    </div>
                                    <div className="text-xs text-gray-500">Sessions</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-green-600">
                                        {new Set(idea.evolution.flatMap(s => s.participants)).size}
                                    </div>
                                    <div className="text-xs text-gray-500">Contributors</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-purple-600">
                                        {Math.round((idea.evolution.length / 4) * 100)}%
                                    </div>
                                    <div className="text-xs text-gray-500">Progress</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Summary stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-4 text-center">
                    {Object.entries(evolutionStages).map(([key, stage]) => (
                        <div key={key}>
                            <div className={`text-2xl font-bold ${stage.color.split(' ')[0]}`}>
                                {evolutionData.filter(idea => idea.currentStage === key).length}
                            </div>
                            <div className="text-sm text-gray-600">{stage.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default IdeaEvolutionTimeline; 