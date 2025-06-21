import React from 'react';
import { Upload, Lightbulb, Link, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ProgressSteps = ({ currentStep, isProcessing }) => {
    const steps = [
        { key: 'upload', icon: Upload, label: 'Upload Transcript' },
        { key: 'extracted', icon: Lightbulb, label: 'Extract Ideas' },
        { key: 'connected', icon: Link, label: 'Connect Ideas' },
        { key: 'generated', icon: Sparkles, label: 'Generate Concepts' }
    ];

    const getStepStatus = (stepKey, index) => {
        const stepIndex = steps.findIndex(s => s.key === stepKey);
        const currentIndex = steps.findIndex(s => s.key === currentStep);

        if (isProcessing) {
            if (stepKey === 'extracted' && currentStep === 'extracting') return 'processing';
            if (stepKey === 'connected' && currentStep === 'connecting') return 'processing';
            if (stepKey === 'generated' && currentStep === 'generating') return 'processing';
        }

        if (currentIndex > index) return 'completed';
        if (currentIndex === index) return 'active';
        return 'pending';
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-center space-x-8 mb-8">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.key, index);
                    const Icon = step.icon;

                    return (
                        <div key={step.key} className="flex items-center">
                            <motion.div
                                className={`flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-500 relative ${status === 'completed'
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg'
                                        : status === 'active'
                                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 border-primary-500 text-white shadow-lg'
                                            : status === 'processing'
                                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 border-yellow-500 text-white shadow-lg animate-pulse'
                                                : 'bg-white border-gray-300 text-gray-400 shadow-sm'
                                    }`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {status === 'processing' ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Icon className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <Icon className="w-6 h-6" />
                                )}

                                {status === 'completed' && (
                                    <motion.div
                                        className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.2 }}
                                    >
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </motion.div>
                                )}
                            </motion.div>

                            <motion.span
                                className={`ml-3 text-sm font-medium transition-colors duration-300 ${status === 'active' || status === 'completed' || status === 'processing'
                                        ? 'text-gray-900'
                                        : 'text-gray-400'
                                    }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                            >
                                {step.label}
                            </motion.span>

                            {index < steps.length - 1 && (
                                <motion.div
                                    className={`w-12 h-1 mx-6 transition-all duration-500 rounded-full ${status === 'completed'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                            : 'bg-gray-300'
                                        }`}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress indicator */}
            <motion.div
                className="w-full max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <div className="bg-gray-200 rounded-full h-2">
                    <motion.div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                            width: currentStep === 'upload' ? '25%' :
                                currentStep === 'extracted' || currentStep === 'extracting' ? '50%' :
                                    currentStep === 'connected' || currentStep === 'connecting' ? '75%' :
                                        currentStep === 'generated' || currentStep === 'generating' ? '100%' : '25%'
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </div>
    );
};

export default ProgressSteps; 