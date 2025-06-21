import React from 'react';
import { Lightbulb, Tag, TrendingUp, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const ExtractedIdeas = ({ extractedIdeas }) => {
    if (extractedIdeas.length === 0) return null;

    const getNoveltyColor = (novelty) => {
        if (novelty >= 0.8) return 'text-purple-600 bg-purple-100 border-purple-200';
        if (novelty >= 0.6) return 'text-blue-600 bg-blue-100 border-blue-200';
        return 'text-green-600 bg-green-100 border-green-200';
    };

    const getNoveltyLabel = (novelty) => {
        if (novelty >= 0.8) return 'Highly Novel';
        if (novelty >= 0.6) return 'Moderately Novel';
        return 'Familiar';
    };

    const getNoveltyIcon = (novelty) => {
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
                    <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl mr-4">
                        <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Extracted Ideas</h3>
                        <p className="text-gray-600">{extractedIdeas.length} insights discovered</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{extractedIdeas.length}</div>
                    <div className="text-sm text-gray-500">Total Ideas</div>
                </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {extractedIdeas.map((idea, index) => (
                    <motion.div
                        key={idea.id}
                        className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
                                    {idea.summary}
                                </h4>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {idea.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                                        >
                                            <Tag className="w-3 h-3 mr-1" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="ml-4 flex flex-col items-end">
                                <div className={`px-3 py-1 text-xs font-medium rounded-full border ${getNoveltyColor(idea.novelty)}`}>
                                    <span className="mr-1">{getNoveltyIcon(idea.novelty)}</span>
                                    {getNoveltyLabel(idea.novelty)}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {Math.round(idea.novelty * 100)}% novelty
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-primary-500">
                            <div className="flex items-start">
                                <Quote className="w-4 h-4 text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-gray-700 italic leading-relaxed">
                                    "{idea.sourceQuote}"
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>ID: {idea.id}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                <span className="text-xs text-gray-500">Extracted</span>
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
                            {extractedIdeas.filter(i => i.novelty >= 0.8).length}
                        </div>
                        <div className="text-sm text-gray-600">Highly Novel</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600">
                            {extractedIdeas.filter(i => i.novelty >= 0.6 && i.novelty < 0.8).length}
                        </div>
                        <div className="text-sm text-gray-600">Moderately Novel</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">
                            {extractedIdeas.filter(i => i.novelty < 0.6).length}
                        </div>
                        <div className="text-sm text-gray-600">Familiar</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ExtractedIdeas; 