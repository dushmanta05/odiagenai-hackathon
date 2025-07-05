'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Send, ArrowLeft, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [frequencyData, setFrequencyData] = useState(new Uint8Array(0));
  const [animationId, setAnimationId] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('odia');
  const [apiResponse, setApiResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now(), text: message, sender: 'user' }]);
      setMessage('');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: "I'll help you create that document. Please provide more details about what you need.",
            sender: 'ai',
          },
        ]);
      }, 1000);
    }
  };

  const handleVoiceClick = () => {
    setShowVoiceModal(true);
    setApiResponse(null);
  };

  const handleStartListening = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyserNode);

      analyserNode.fftSize = 256;
      const bufferLength = analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      setAudioContext(audioCtx);
      setAnalyser(analyserNode);
      setFrequencyData(dataArray);

      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        sendAudioToAPI(blob);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      visualizeFrequency(analyserNode, dataArray);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Please allow microphone access to record audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    if (audioStream) {
      for (const track of audioStream.getTracks()) {
        track.stop();
      }
    }

    if (audioContext) {
      audioContext.close();
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    setIsRecording(false);
    setAudioStream(null);
    setAudioContext(null);
    setAnalyser(null);
  };

  const visualizeFrequency = (analyserNode, dataArray) => {
    const animate = () => {
      analyserNode.getByteFrequencyData(dataArray);
      setFrequencyData(new Uint8Array(dataArray));
      if (isRecording) {
        setAnimationId(requestAnimationFrame(animate));
      }
    };
    animate();
  };

  const FrequencyVisualizer = () => {
    const maxHeight = 40;
    const barCount = 12;
    const barWidth = 3;
    const barSpacing = 2;

    return (
      <div className='flex items-end justify-center space-x-1' style={{ height: maxHeight }}>
        {Array.from({ length: barCount }).map((_, i) => {
          const dataIndex = Math.floor((i / barCount) * frequencyData.length);
          const height = Math.max(2, (frequencyData[dataIndex] / 255) * maxHeight);

          return (
            <motion.div
              key={`bar-${dataIndex}`}
              className='bg-indigo-500 rounded-full'
              style={{
                width: barWidth,
                height: height,
              }}
              animate={{
                height: height,
              }}
              transition={{
                duration: 0.1,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </div>
    );
  };

  const sendAudioToAPI = async (audioBlob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await axios.post(
        'http://localhost:3001/generate/application-form',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setApiResponse(response.data);
      setShowVoiceModal(false);
    } catch (error) {
      console.error('Error sending audio to API:', error);
      alert('Error processing audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <header
        className={`border-b transition-colors duration-300 ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}
      >
        <div className='max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex items-center space-x-4'>
            <Link
              href='/'
              className={`transition-colors duration-200 ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ArrowLeft className='w-6 h-6' />
            </Link>
            <div>
              <h1
                className={`text-xl sm:text-2xl font-bold transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                What document would you like to build today?
              </h1>
              <p
                className={`text-sm sm:text-base mt-1 transition-colors duration-300 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                Speak or type your requirements, and I'll help you create it
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {darkMode ? <Sun className='w-6 h-6' /> : <Moon className='w-6 h-6' />}
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <div className='flex flex-col h-[calc(100vh-120px)]'>
        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
          <div className='max-w-4xl mx-auto space-y-4'>
            {messages.length === 0 ? (
              <div className='text-center py-12'>
                <div
                  className={`text-6xl mb-4 transition-colors duration-300 ${
                    darkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}
                >
                  💬
                </div>
                <p
                  className={`text-lg transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Start by telling me what document you'd like to create
                </p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : darkMode
                          ? 'bg-gray-700 text-gray-100'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className='text-sm sm:text-base'>{msg.text}</p>
                    </div>
                  </motion.div>
                ))}

                {/* API Response Display */}
                {apiResponse && (
                  <div className='mt-6 border-t pt-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3
                        className={`text-lg font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        Generated Content
                      </h3>
                      <div className='flex rounded-lg overflow-hidden border'>
                        <button
                          type='button'
                          onClick={() => setSelectedLanguage('odia')}
                          className={`px-4 py-2 text-sm font-medium transition-colors ${
                            selectedLanguage === 'odia'
                              ? 'bg-indigo-600 text-white'
                              : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          Odia
                        </button>
                        <button
                          type='button'
                          onClick={() => setSelectedLanguage('english')}
                          className={`px-4 py-2 text-sm font-medium transition-colors ${
                            selectedLanguage === 'english'
                              ? 'bg-indigo-600 text-white'
                              : darkMode
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          English
                        </button>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {selectedLanguage === 'odia' ? apiResponse.odia : apiResponse.english}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div
          className={`border-t transition-colors duration-300 ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}
        >
          <div className='max-w-4xl mx-auto p-4 sm:p-6'>
            <div className='flex items-center space-x-3'>
              <div className='flex-1'>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder='Type your message or use voice input...'
                  className={`w-full p-3 rounded-lg border resize-none transition-colors duration-300 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  rows='1'
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
                  }}
                />
              </div>

              <div className='flex items-center space-x-2'>
                <motion.button
                  type='button'
                  onClick={handleVoiceClick}
                  className={`p-3 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ height: '48px', width: '48px' }}
                >
                  <Mic className='w-5 h-5' />
                </motion.button>

                <motion.button
                  type='button'
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className={`p-3 rounded-lg transition-colors duration-200 ${
                    message.trim()
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                      : darkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  whileHover={message.trim() ? { scale: 1.05 } : {}}
                  whileTap={message.trim() ? { scale: 0.95 } : {}}
                  style={{ height: '48px', width: '48px' }}
                >
                  <Send className='w-5 h-5' />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Modal */}
      <AnimatePresence>
        {showVoiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
            onClick={() => setShowVoiceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`max-w-md w-full rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className='text-center'>
                <div className='mb-6'>
                  <div
                    className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${
                      isRecording
                        ? 'bg-red-100 dark:bg-red-900'
                        : 'bg-indigo-100 dark:bg-indigo-900'
                    }`}
                  >
                    {isRecording ? (
                      <FrequencyVisualizer />
                    ) : (
                      <Mic className='w-10 h-10 text-indigo-600' />
                    )}
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Voice Input'}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isRecording
                      ? 'Recording your voice. Click Stop when finished.'
                      : isProcessing
                      ? 'Processing your audio...'
                      : 'Click Start to begin recording in English or Odia'}
                  </p>
                </div>

                <div className='flex space-x-3'>
                  <button
                    type='button'
                    onClick={() => setShowVoiceModal(false)}
                    disabled={isRecording || isProcessing}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isRecording || isProcessing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    onClick={handleStartListening}
                    disabled={isProcessing}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isProcessing
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    {isProcessing
                      ? 'Processing...'
                      : isRecording
                      ? 'Stop Recording'
                      : 'Start Recording'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
