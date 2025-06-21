import React from 'react';
import { Link, Sparkles, Zap, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const ActionButtons = ({
    extractedIdeas,
    connections,
    onConnect,
    onGenerate,
    isProcessing,
    step
}) => {
    if (extractedIdeas.length === 0) return null;

    return (
        <motion.div
            className="glass rounded-2xl shadow-professional-lg p-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mr-4">
                    <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900">AI Agent Actions</h3>
                    <p className="text-gray-600">Let AI analyze and synthesize your ideas</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Connect Ideas Button */}
                <motion.button
                    onClick={onConnect}
                    disabled={isProcessing}
                    className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    {step === 'connecting' ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="mr-3"
                            >
                                <Zap className="w-5 h-5" />
                            </motion.div>
                            <span>Finding Connections...</span>
                        </>
                    ) : (
                        <>
                            <Link className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                            <span>Connect Ideas ({extractedIdeas.length} ideas)</span>
                        </>
                    )}
                </motion.button>

                {/* Generate Ideas Button */}
                {connections.length > 0 && (
                    <motion.button
                        onClick={onGenerate}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 font-medium shadow-lg group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {step === 'generating' ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="mr-3"
                                >
                                    <Sparkles className="w-5 h-5" />
                                </motion.div>
                                <span>Generating Breakthrough Ideas...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                                <span>Generate New Concepts ({connections.length} connections)</span>
                            </>
                        )}
                    </motion.button>
                )}
            </div>

            {/* Progress indicator */}
            <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Processing Status</span>
                    <span className="font-medium">
                        {step === 'connecting' ? 'Connecting Ideas...' :
                            step === 'generating' ? 'Generating Concepts...' : 'Ready'}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                            width: step === 'connecting' ? '50%' :
                                step === 'generating' ? '100%' : '0%'
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">{extractedIdeas.length}</div>
                    <div className="text-sm text-purple-700">Ideas Extracted</div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="text-2xl font-bold text-pink-600">{connections.length}</div>
                    <div className="text-sm text-pink-700">Connections Found</div>
                </div>
            </div>
        </motion.div>
    );
};

export default ActionButtons; 