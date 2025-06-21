import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, X, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion } from 'framer-motion';
import MeetingSelector from './MeetingSelector';

const TranscriptUpload = ({ transcript, setTranscript, onExtractIdeas, isProcessing, step }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [fileName, setFileName] = useState('');
    const [useMeetStream, setUseMeetStream] = useState(false);
    const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
    const fileInputRef = useRef(null);

    // Sample data for demonstration
    const sampleTranscript = `"So I was thinking — what if we gamify user onboarding like Duolingo does for learning?"
"Hmm, yeah, or maybe use AI to recommend learning paths based on how fast users click through tasks."
"Could we tie that into our feedback system and see which flows work best?"
"What about creating a community aspect where users can share their progress?"
"We could also use voice interfaces for accessibility - like having users speak their preferences."
"Maybe we could integrate with existing productivity tools they already use."`;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = (file) => {
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTranscript(e.target.result);
                setFileName(file.name);
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a text file (.txt)');
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const loadSample = () => {
        setTranscript(sampleTranscript);
        setFileName('Sample Transcript');
    };

    const clearTranscript = () => {
        setTranscript('');
        setFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleTranscriptLoaded = (transcriptText, meetingTitle) => {
        setTranscript(transcriptText);
        setFileName(meetingTitle);
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
                    <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl mr-4">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Meeting Transcript</h2>
                        <p className="text-gray-600">Upload or fetch your brainstorming session transcript</p>
                    </div>
                </div>
                
                {/* Toggle between manual upload and MeetStream */}
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Manual Upload</span>
                    <button
                        onClick={() => setUseMeetStream(!useMeetStream)}
                        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        style={{
                            backgroundColor: useMeetStream ? '#3B82F6' : '#D1D5DB'
                        }}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                useMeetStream ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                    <span className="text-sm font-medium text-gray-700">MeetStream API</span>
                </div>
            </div>

            {useMeetStream ? (
                <MeetingSelector
                    onTranscriptLoaded={handleTranscriptLoaded}
                    onLoadingChange={setIsLoadingTranscript}
                />
            ) : (
                <>
                    {/* File upload area */}
                    <div
                        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragOver
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".txt"
                            onChange={handleFileInput}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />

                        <motion.div
                            animate={{ y: isDragOver ? -5 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-700 mb-2">
                                {isDragOver ? 'Drop your file here' : 'Drag & drop a transcript file'}
                            </p>
                            <p className="text-gray-500 mb-4">or click to browse</p>
                            <p className="text-sm text-gray-400">Supports .txt files</p>
                        </motion.div>
                    </div>

                    {/* File info */}
                    {fileName && (
                        <motion.div
                            className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center">
                                <FileText className="w-5 h-5 text-green-600 mr-3" />
                                <span className="text-green-800 font-medium">{fileName}</span>
                            </div>
                            <button
                                onClick={clearTranscript}
                                className="p-1 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    )}

                    {/* Text area */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Or paste transcript directly:
                        </label>
                        <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder={`Paste your meeting transcript here...

Example:
"What if we gamify user onboarding like Duolingo?"
"Maybe use AI to recommend learning paths..."`}
                            className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
                        />
                    </div>
                </>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                {!useMeetStream && (
                    <motion.button
                        onClick={loadSample}
                        className="flex-1 flex items-center justify-center px-6 py-3 text-primary-600 border-2 border-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-200 font-medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Load Sample Data
                    </motion.button>
                )}

                <motion.button
                    onClick={onExtractIdeas}
                    disabled={!transcript.trim() || isProcessing || isLoadingTranscript}
                    className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-xl hover:from-primary-700 hover:to-secondary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {step === 'extracting' || isLoadingTranscript ? (
                        <>
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                            </motion.div>
                            {isLoadingTranscript ? 'Loading Transcript...' : 'Extracting Ideas...'}
                        </>
                    ) : (
                        <>
                            <FileText className="w-4 h-4 mr-2" />
                            Extract Ideas
                        </>
                    )}
                </motion.button>
            </div>

            {/* Character count */}
            <div className="mt-4 text-right">
                <span className="text-sm text-gray-500">
                    {transcript.length} characters
                </span>
            </div>
        </motion.div>
    );
};

export default TranscriptUpload; 