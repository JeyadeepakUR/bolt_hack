import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
    return (
        <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="flex items-center justify-center mb-6">
                <motion.div
                    className="relative"
                    animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <div className="relative">
                        <Sparkles className="w-16 h-16 text-primary-500" />
                        <motion.div
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-accent-400 to-secondary-500 rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div
                            className="absolute -bottom-1 -left-1 w-4 h-4 bg-primary-400 rounded-full"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1
                            }}
                        />
                    </div>
                </motion.div>
            </div>

            <motion.h1
                className="text-5xl font-bold gradient-text mb-4 tracking-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                DewDrop.AI
            </motion.h1>

            <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                Transform brainstorming sessions into breakthrough innovations with AI-powered idea synthesis and connection mapping
            </motion.p>

            <motion.div
                className="flex items-center justify-center mt-6 space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span>AI-Powered Analysis</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>Innovation Synthesis</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Professional Grade</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Header; 