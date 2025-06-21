import React from 'react';
import { Download, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = ({ generatedIdeas }) => {
    const handleExport = () => {
        if (generatedIdeas.length === 0) return;

        const exportData = {
            timestamp: new Date().toISOString(),
            totalIdeas: generatedIdeas.length,
            ideas: generatedIdeas.map(idea => ({
                name: idea.name,
                pitch: idea.pitch,
                useCase: idea.useCase,
                tags: idea.tags,
                novelty: idea.novelty,
                basedOn: idea.basedOn
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dewdrop-ideas-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <motion.footer
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
        >
            <div className="glass rounded-2xl shadow-professional-lg p-8 border border-white/20 max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-6">
                    <Sparkles className="w-6 h-6 text-primary-500 mr-2" />
                    <h3 className="text-xl font-bold gradient-text">DewDrop.AI</h3>
                </div>

                <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                    Revitalizing internet creativity through AI-powered idea synthesis and breakthrough innovation discovery
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Professional Grade</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>AI-Powered</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Innovation Focused</span>
                        </div>
                    </div>
                </div>

                {generatedIdeas.length > 0 && (
                    <motion.button
                        onClick={handleExport}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 font-medium shadow-lg mb-6"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Ideas ({generatedIdeas.length} concepts)
                    </motion.button>
                )}

                <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-500 mb-2">
                        Made with <Heart className="inline w-4 h-4 text-red-500" /> for innovators and creators
                    </p>
                    <p className="text-xs text-gray-400">
                        © 2024 DewDrop.AI • Transforming brainstorming into breakthrough innovations
                    </p>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer; 