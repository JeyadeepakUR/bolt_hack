import React from 'react';
import { Sparkles, RefreshCw, Target, Users, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const GeneratedIdeas = ({ generatedIdeas, onRemix }) => {
    if (generatedIdeas.length === 0) return null;

    const getNoveltyColor = (novelty) => {
        if (novelty >= 0.8) return 'text-purple-600 bg-purple-100 border-purple-200';
        if (novelty >= 0.6) return 'text-blue-600 bg-blue-100 border-blue-200';
        return 'text-green-600 bg-green-100 border-green-200';
    };

    const getNoveltyIcon = (novelty) => {
        if (novelty >= 0.9) return '🚀';
        if (novelty >= 0.8) return '🔥';
        if (novelty >= 0.6) return '💡';
        return '✨';
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
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">AI-Generated Concepts</h3>
                        <p className="text-gray-600">{generatedIdeas.length} breakthrough ideas</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{generatedIdeas.length}</div>
                    <div className="text-sm text-gray-500">New Concepts</div>
                </div>
            </div>

            <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {generatedIdeas.map((idea, index) => (
                    <motion.div
                        key={idea.id}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <h4 className="text-xl font-bold text-purple-900">{idea.name}</h4>
                                    <div className={`px-3 py-1 text-xs font-medium rounded-full border ${getNoveltyColor(idea.novelty)}`}>
                                        <span className="mr-1">{getNoveltyIcon(idea.novelty)}</span>
                                        {Math.round(idea.novelty * 100)}% Novel
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-4 font-medium leading-relaxed">
                                    {idea.pitch}
                                </p>
                            </div>

                            <motion.button
                                onClick={() => onRemix(idea.id)}
                                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors duration-200 ml-4"
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                whileTap={{ scale: 0.9 }}
                                title="Remix this idea"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Use Case */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-4 border border-purple-100">
                            <div className="flex items-center mb-2">
                                <Target className="w-4 h-4 text-purple-600 mr-2" />
                                <p className="text-sm font-medium text-purple-900">Use Case</p>
                            </div>
                            <p className="text-sm text-gray-800 leading-relaxed">
                                {idea.useCase}
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {idea.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center px-3 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full border border-purple-200"
                                >
                                    <Zap className="w-3 h-3 mr-1" />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Based on */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                            <div className="flex items-center mb-2">
                                <Star className="w-4 h-4 text-blue-600 mr-2" />
                                <p className="text-sm font-medium text-blue-900">Based on Connections</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {idea.basedOn.map((connection, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                                    >
                                        {connection}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-purple-200">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <Users className="w-3 h-3" />
                                    <span>Concept #{idea.id}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-500">AI Generated</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Summary stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-purple-600">
                            {generatedIdeas.filter(i => i.novelty >= 0.8).length}
                        </div>
                        <div className="text-sm text-gray-600">Highly Novel</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-pink-600">
                            {Math.round(generatedIdeas.reduce((acc, i) => acc + i.novelty, 0) / generatedIdeas.length * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Avg Novelty</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-indigo-600">
                            {generatedIdeas.reduce((acc, i) => acc + i.tags.length, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Tags</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GeneratedIdeas; 