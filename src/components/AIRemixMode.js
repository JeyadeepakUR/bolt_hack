import React, { useState } from 'react';
import { Zap, Dna, Sparkles, ArrowRight, RefreshCw, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const AIRemixMode = ({ ideaDatabase, onRemixComplete }) => {
    const [selectedIdeas, setSelectedIdeas] = useState([]);
    const [isRemixing, setIsRemixing] = useState(false);
    const [remixedIdeas, setRemixedIdeas] = useState([]);
    const [showGenealogy, setShowGenealogy] = useState(false);

    // Mock idea database for selection
    const availableIdeas = [
        {
            id: 1,
            title: "Gamify user onboarding using Duolingo-style feedback loops",
            tags: ["UX", "Gamification", "Onboarding"],
            novelty: 0.7,
            cognitiveStyle: "analytical"
        },
        {
            id: 2,
            title: "AI-powered adaptive learning paths based on user interaction speed",
            tags: ["AI", "Personalization", "UX"],
            novelty: 0.8,
            cognitiveStyle: "systematic"
        },
        {
            id: 3,
            title: "Voice interface integration for accessibility in onboarding",
            tags: ["Accessibility", "Voice UI", "Inclusive Design"],
            novelty: 0.9,
            cognitiveStyle: "intuitive"
        },
        {
            id: 4,
            title: "Community-driven progress sharing for user engagement",
            tags: ["Community", "Social", "Engagement"],
            novelty: 0.5,
            cognitiveStyle: "emotional"
        },
        {
            id: 5,
            title: "Real-time user behavior analysis for UX optimization",
            tags: ["Analytics", "UX", "Testing"],
            novelty: 0.6,
            cognitiveStyle: "strategic"
        }
    ];

    const handleIdeaSelection = (idea) => {
        if (selectedIdeas.find(selected => selected.id === idea.id)) {
            setSelectedIdeas(selectedIdeas.filter(selected => selected.id !== idea.id));
        } else if (selectedIdeas.length < 2) {
            setSelectedIdeas([...selectedIdeas, idea]);
        }
    };

    const performAIRemix = async () => {
        if (selectedIdeas.length !== 2) return;

        setIsRemixing(true);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 3000));

        const idea1 = selectedIdeas[0];
        const idea2 = selectedIdeas[1];

        // AI remix logic - in real app this would use actual AI
        const remixedIdeas = [
            {
                id: Date.now(),
                name: `${idea1.title.split(' ')[0]} + ${idea2.title.split(' ')[0]} Fusion`,
                pitch: `A revolutionary platform that combines ${idea1.title.toLowerCase()} with ${idea2.title.toLowerCase()} to create an unprecedented user experience that adapts in real-time to user behavior while maintaining accessibility and community engagement.`,
                useCase: "Next-generation SaaS platforms requiring both intelligent personalization and inclusive design",
                tags: [...new Set([...idea1.tags, ...idea2.tags])],
                novelty: Math.min(idea1.novelty + idea2.novelty + 0.2, 1),
                basedOn: [idea1.title, idea2.title],
                genealogy: {
                    parent1: idea1,
                    parent2: idea2,
                    fusionMethod: "AI-powered semantic synthesis",
                    noveltyBoost: 0.2
                }
            },
            {
                id: Date.now() + 1,
                name: `${idea2.title.split(' ')[0]} + ${idea1.title.split(' ')[0]} Pro`,
                pitch: `An enterprise-grade solution that leverages ${idea2.title.toLowerCase()} enhanced with ${idea1.title.toLowerCase()} capabilities, creating a comprehensive platform for modern digital experiences.`,
                useCase: "Enterprise applications requiring sophisticated user engagement and analytics",
                tags: [...new Set([...idea2.tags, ...idea1.tags, "Enterprise"])],
                novelty: Math.min(idea2.novelty + idea1.novelty + 0.15, 1),
                basedOn: [idea2.title, idea1.title],
                genealogy: {
                    parent1: idea2,
                    parent2: idea1,
                    fusionMethod: "Reverse engineering with enterprise focus",
                    noveltyBoost: 0.15
                }
            }
        ];

        setRemixedIdeas(remixedIdeas);
        setIsRemixing(false);
        setShowGenealogy(true);

        if (onRemixComplete) {
            onRemixComplete(remixedIdeas);
        }
    };

    const getCognitiveStyleColor = (style) => {
        const colors = {
            analytical: 'text-blue-600 bg-blue-100 border-blue-200',
            visual: 'text-purple-600 bg-purple-100 border-purple-200',
            emotional: 'text-pink-600 bg-pink-100 border-pink-200',
            strategic: 'text-green-600 bg-green-100 border-green-200',
            intuitive: 'text-orange-600 bg-orange-100 border-orange-200',
            systematic: 'text-indigo-600 bg-indigo-100 border-indigo-200'
        };
        return colors[style] || colors.analytical;
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
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                        <Dna className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">AI Remix Mode</h3>
                        <p className="text-gray-600">Fuse unrelated ideas to break creative blocks</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{remixedIdeas.length}</div>
                    <div className="text-sm text-gray-500">Remixed Ideas</div>
                </div>
            </div>

            {/* Idea Selection */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Select 2 Ideas to Remix ({selectedIdeas.length}/2)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
                    {availableIdeas.map((idea) => (
                        <motion.div
                            key={idea.id}
                            onClick={() => handleIdeaSelection(idea)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedIdeas.find(selected => selected.id === idea.id)
                                ? 'border-purple-500 bg-purple-50 shadow-lg'
                                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <h5 className="font-medium text-gray-900 text-sm leading-tight">
                                    {idea.title}
                                </h5>
                                {selectedIdeas.find(selected => selected.id === idea.id) && (
                                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {idea.tags.slice(0, 2).map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCognitiveStyleColor(idea.cognitiveStyle)}`}>
                                    {idea.cognitiveStyle}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {Math.round(idea.novelty * 100)}% novel
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Remix Button */}
            {selectedIdeas.length === 2 && (
                <motion.button
                    onClick={performAIRemix}
                    disabled={isRemixing}
                    className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg mb-6"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isRemixing ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-3"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </motion.div>
                            <span>AI is Remixing Ideas...</span>
                        </>
                    ) : (
                        <>
                            <Zap className="w-5 h-5 mr-3" />
                            <span>Remix Ideas with AI</span>
                        </>
                    )}
                </motion.button>
            )}

            {/* Selected Ideas Preview */}
            {selectedIdeas.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Selected Ideas</h4>
                    <div className="flex items-center space-x-4">
                        {selectedIdeas.map((idea, index) => (
                            <div key={idea.id} className="flex items-center">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-3 text-white">
                                    <Brain className="w-4 h-4" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{idea.title.split(' ')[0]}...</p>
                                    <p className="text-xs text-gray-500">{idea.cognitiveStyle}</p>
                                </div>
                                {index === 0 && selectedIdeas.length === 2 && (
                                    <ArrowRight className="w-5 h-5 text-purple-500 mx-2" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Remixed Ideas Results */}
            {remixedIdeas.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-900">Remixed Ideas</h4>
                        <button
                            onClick={() => setShowGenealogy(!showGenealogy)}
                            className="text-sm text-purple-600 hover:text-purple-700"
                        >
                            {showGenealogy ? 'Hide' : 'Show'} Genealogy
                        </button>
                    </div>

                    {remixedIdeas.map((idea, index) => (
                        <motion.div
                            key={idea.id}
                            className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h5 className="text-lg font-bold text-purple-900 mb-2">{idea.name}</h5>
                                    <p className="text-gray-700 mb-3">{idea.pitch}</p>
                                </div>
                                <div className="ml-4 text-right">
                                    <div className={`px-3 py-1 text-xs font-medium rounded-full border text-purple-600 bg-purple-100 border-purple-200`}>
                                        <Sparkles className="w-3 h-3 inline mr-1" />
                                        {Math.round(idea.novelty * 100)}% Novel
                                    </div>
                                </div>
                            </div>

                            {/* Genealogy */}
                            {showGenealogy && (
                                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-purple-200 mb-4">
                                    <h6 className="font-medium text-purple-900 mb-2">Idea DNA</h6>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Parent 1</p>
                                            <p className="text-sm font-medium text-gray-900">{idea.genealogy.parent1.title}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Parent 2</p>
                                            <p className="text-sm font-medium text-gray-900">{idea.genealogy.parent2.title}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-xs text-gray-500">
                                            <strong>Fusion Method:</strong> {idea.genealogy.fusionMethod}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            <strong>Novelty Boost:</strong> +{Math.round(idea.genealogy.noveltyBoost * 100)}%
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mb-3">
                                {idea.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
                                <p className="text-sm text-gray-600 mb-1"><strong>Use Case:</strong></p>
                                <p className="text-sm text-gray-800">{idea.useCase}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-purple-600">{remixedIdeas.length}</div>
                        <div className="text-sm text-gray-600">Remixed Ideas</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-pink-600">
                            {remixedIdeas.length > 0 ? Math.round(remixedIdeas.reduce((acc, idea) => acc + idea.novelty, 0) / remixedIdeas.length * 100) : 0}%
                        </div>
                        <div className="text-sm text-gray-600">Avg Novelty</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-indigo-600">{availableIdeas.length}</div>
                        <div className="text-sm text-gray-600">Available Ideas</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AIRemixMode; 