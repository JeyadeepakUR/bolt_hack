import React from 'react';
import { Database, TrendingUp, Lightbulb, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const DatabaseStats = ({ ideaDatabase, generatedIdeas }) => {
    const stats = [
        {
            icon: Lightbulb,
            label: 'Ideas Captured',
            value: ideaDatabase.length,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            icon: Sparkles,
            label: 'New Concepts',
            value: generatedIdeas.length,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            icon: TrendingUp,
            label: 'Innovation Score',
            value: Math.round((generatedIdeas.length / Math.max(ideaDatabase.length, 1)) * 100),
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            suffix: '%'
        }
    ];

    return (
        <motion.div
            className="glass rounded-2xl shadow-professional-lg p-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-4">
                    <Database className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Innovation Database</h3>
                    <p className="text-gray-600">Track your creative progress and insights</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 text-center`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 * index }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg mb-4`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            <motion.div
                                className="text-3xl font-bold text-gray-900 mb-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 * index }}
                            >
                                {stat.value}{stat.suffix || ''}
                            </motion.div>

                            <div className="text-sm text-gray-600 font-medium">
                                {stat.label}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Progress visualization */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Database Growth</h4>
                    <span className="text-sm text-gray-500">
                        {ideaDatabase.length + generatedIdeas.length} total items
                    </span>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Extracted Ideas</span>
                        <span className="text-sm font-medium text-gray-900">{ideaDatabase.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(ideaDatabase.length / Math.max(ideaDatabase.length + generatedIdeas.length, 1)) * 100}%`
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Generated Concepts</span>
                        <span className="text-sm font-medium text-gray-900">{generatedIdeas.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(generatedIdeas.length / Math.max(ideaDatabase.length + generatedIdeas.length, 1)) * 100}%`
                            }}
                            transition={{ duration: 1, delay: 0.7 }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent activity */}
            {ideaDatabase.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                    <div className="space-y-3">
                        {ideaDatabase.slice(-3).map((idea, index) => (
                            <motion.div
                                key={idea.id}
                                className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-gray-200"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {idea.summary}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {idea.tags.slice(0, 2).join(', ')}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default DatabaseStats; 