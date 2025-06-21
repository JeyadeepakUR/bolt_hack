import React, { useState } from 'react';
import ThreeBackground from './components/ThreeBackground';
import Header from './components/Header';
import ProgressSteps from './components/ProgressSteps';
import TranscriptUpload from './components/TranscriptUpload';
import ActionButtons from './components/ActionButtons';
import DatabaseStats from './components/DatabaseStats';
import ExtractedIdeas from './components/ExtractedIdeas';
import GeneratedIdeas from './components/GeneratedIdeas';
import Connections from './components/Connections';
import Footer from './components/Footer';

const App = () => {
    const [transcript, setTranscript] = useState('');
    const [extractedIdeas, setExtractedIdeas] = useState([]);
    const [connections, setConnections] = useState([]);
    const [generatedIdeas, setGeneratedIdeas] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState('upload');
    const [ideaDatabase, setIdeaDatabase] = useState([]);

    // Simulated AI agents
    const extractorAgent = (text) => {
        const ideas = [
            {
                id: 1,
                summary: "Gamify user onboarding using Duolingo-style feedback loops",
                tags: ["UX", "Gamification", "Onboarding"],
                sourceQuote: "gamify user onboarding like Duolingo does for learning",
                novelty: 0.7
            },
            {
                id: 2,
                summary: "AI-powered adaptive learning paths based on user interaction speed",
                tags: ["AI", "Personalization", "UX"],
                sourceQuote: "AI to recommend learning paths based on how fast users click",
                novelty: 0.8
            },
            {
                id: 3,
                summary: "Feedback integration to A/B test onboarding flows dynamically",
                tags: ["Analytics", "UX", "Testing"],
                sourceQuote: "tie that into our feedback system and see which flows work best",
                novelty: 0.6
            },
            {
                id: 4,
                summary: "Community-driven progress sharing for user engagement",
                tags: ["Community", "Social", "Engagement"],
                sourceQuote: "community aspect where users can share their progress",
                novelty: 0.5
            },
            {
                id: 5,
                summary: "Voice interface integration for accessibility in onboarding",
                tags: ["Accessibility", "Voice UI", "Inclusive Design"],
                sourceQuote: "voice interfaces for accessibility - like having users speak",
                novelty: 0.9
            }
        ];
        return ideas;
    };

    const connectorAgent = (ideas) => {
        return [
            {
                id: 1,
                idea1: ideas[0],
                idea2: ideas[1],
                connection: "Both focus on personalized user experience optimization",
                strength: 0.8,
                combinedTopic: "Adaptive Gamified Learning"
            },
            {
                id: 2,
                idea1: ideas[1],
                idea2: ideas[2],
                connection: "AI-driven personalization + feedback optimization",
                strength: 0.9,
                combinedTopic: "Smart Adaptive Systems"
            },
            {
                id: 3,
                idea1: ideas[3],
                idea2: ideas[4],
                connection: "Alternative interaction modalities for engagement",
                strength: 0.6,
                combinedTopic: "Multi-Modal Community Features"
            }
        ];
    };

    const generatorAgent = (connections) => {
        return [
            {
                id: 1,
                name: "SmartLoop",
                pitch: "An AI-powered onboarding system that dynamically adapts based on user interaction speed and gamified feedback loops",
                useCase: "SaaS startups wanting to maximize product adoption with personalized experiences",
                tags: ["AI", "Gamification", "Personalization"],
                novelty: 0.85,
                basedOn: ["Adaptive Learning", "Gamified Feedback"]
            },
            {
                id: 2,
                name: "VoiceFlow Community",
                pitch: "A voice-first onboarding platform where users can share progress and get community support through speech interaction",
                useCase: "Accessibility-focused products and elderly user demographics",
                tags: ["Voice UI", "Community", "Accessibility"],
                novelty: 0.92,
                basedOn: ["Voice Interface", "Community Sharing"]
            },
            {
                id: 3,
                name: "FlowMind Analytics",
                pitch: "Real-time user behavior analysis that automatically optimizes onboarding flows using AI feedback loops",
                useCase: "Product teams needing instant UX optimization without manual A/B testing",
                tags: ["Analytics", "AI", "Automation"],
                novelty: 0.78,
                basedOn: ["AI Adaptation", "Feedback Integration"]
            }
        ];
    };

    const handleExtractIdeas = async () => {
        setIsProcessing(true);
        setStep('extracting');

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        const ideas = extractorAgent(transcript);
        setExtractedIdeas(ideas);
        setIdeaDatabase(prev => [...prev, ...ideas]);
        setStep('extracted');
        setIsProcessing(false);
    };

    const handleConnect = async () => {
        setIsProcessing(true);
        setStep('connecting');

        await new Promise(resolve => setTimeout(resolve, 1500));

        const newConnections = connectorAgent(extractedIdeas);
        setConnections(newConnections);
        setStep('connected');
        setIsProcessing(false);
    };

    const handleGenerate = async () => {
        setIsProcessing(true);
        setStep('generating');

        await new Promise(resolve => setTimeout(resolve, 2000));

        const newIdeas = generatorAgent(connections);
        setGeneratedIdeas(newIdeas);
        setStep('generated');
        setIsProcessing(false);
    };

    const handleRemix = (ideaId) => {
        const idea = generatedIdeas.find(i => i.id === ideaId);
        if (idea) {
            const remixed = {
                ...idea,
                id: Date.now(),
                name: `${idea.name} Pro`,
                pitch: `Enhanced ${idea.pitch.toLowerCase()} with enterprise-grade security and scalability`,
                novelty: Math.min(idea.novelty + 0.1, 1)
            };
            setGeneratedIdeas(prev => [...prev, remixed]);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
            {/* Three.js Background */}
            <ThreeBackground />

            {/* Content */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header */}
                    <Header />

                    {/* Progress Steps */}
                    <ProgressSteps currentStep={step} isProcessing={isProcessing} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Input & Controls */}
                        <div className="space-y-6">
                            <TranscriptUpload
                                transcript={transcript}
                                setTranscript={setTranscript}
                                onExtractIdeas={handleExtractIdeas}
                                isProcessing={isProcessing}
                                step={step}
                            />

                            <ActionButtons
                                extractedIdeas={extractedIdeas}
                                connections={connections}
                                onConnect={handleConnect}
                                onGenerate={handleGenerate}
                                isProcessing={isProcessing}
                                step={step}
                            />

                            <DatabaseStats
                                ideaDatabase={ideaDatabase}
                                generatedIdeas={generatedIdeas}
                            />
                        </div>

                        {/* Right Column - Results */}
                        <div className="space-y-6">
                            <ExtractedIdeas extractedIdeas={extractedIdeas} />

                            <GeneratedIdeas
                                generatedIdeas={generatedIdeas}
                                onRemix={handleRemix}
                            />

                            <Connections connections={connections} />
                        </div>
                    </div>

                    {/* Footer */}
                    <Footer generatedIdeas={generatedIdeas} />
                </div>
            </div>
        </div>
    );
};

export default App; 