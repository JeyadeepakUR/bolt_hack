import React from 'react';
import { Link, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Connections = ({ connections }) => {
    if (connections.length === 0) return null;

    const getStrengthColor = (strength) => {
        if (strength >= 0.8) return 'text-green-600 bg-green-100 border-green-200';
        if (strength >= 0.6) return 'text-blue-600 bg-blue-100 border-blue-200';
        return 'text-orange-600 bg-orange-100 border-orange-200';
    };

    const getStrengthIcon = (strength) => {
        if (strength >= 0.8) return '⚡';
        if (strength >= 0.6) return '🔗';
        return '🔸';
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
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl mr-4">
                        <Link className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Idea Connections</h3>
                        <p className="text-gray-600">{connections.length} relationships discovered</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{connections.length}</div>
                    <div className="text-sm text-gray-500">Connections</div>
                </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {connections.map((connection, index) => (
                    <motion.div
                        key={connection.id}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                    <h4 className="text-lg font-bold text-blue-900">{connection.combinedTopic}</h4>
                                    <div className={`px-3 py-1 text-xs font-medium rounded-full border ${getStrengthColor(connection.strength)}`}>
                                        <span className="mr-1">{getStrengthIcon(connection.strength)}</span>
                                        {Math.round(connection.strength * 100)}% match
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    {connection.connection}
                                </p>
                            </div>
                        </div>

                        {/* Connected Ideas */}
                        <div className="space-y-3">
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-l-4 border-blue-500">
                                <div className="flex items-center mb-2">
                                    <Zap className="w-4 h-4 text-blue-600 mr-2" />
                                    <p className="text-sm font-medium text-blue-900">Idea 1</p>
                                </div>
                                <p className="text-sm text-gray-800 leading-relaxed">
                                    {connection.idea1.summary}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {connection.idea1.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-center">
                                <motion.div
                                    className="p-2 bg-blue-500 rounded-full"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 180, 360]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </motion.div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-l-4 border-indigo-500">
                                <div className="flex items-center mb-2">
                                    <TrendingUp className="w-4 h-4 text-indigo-600 mr-2" />
                                    <p className="text-sm font-medium text-indigo-900">Idea 2</p>
                                </div>
                                <p className="text-sm text-gray-800 leading-relaxed">
                                    {connection.idea2.summary}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {connection.idea2.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-blue-200">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <Link className="w-3 h-3" />
                                    <span>Connection #{connection.id}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-xs text-gray-500">AI Discovered</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Summary stats */}
            <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-green-600">
                            {connections.filter(c => c.strength >= 0.8).length}
                        </div>
                        <div className="text-sm text-gray-600">Strong Connections</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600">
                            {Math.round(connections.reduce((acc, c) => acc + c.strength, 0) / connections.length * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Avg Strength</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-indigo-600">
                            {new Set(connections.flatMap(c => [...c.idea1.tags, ...c.idea2.tags])).size}
                        </div>
                        <div className="text-sm text-gray-600">Unique Tags</div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Connections; 