'use client';

import { useState, useEffect } from 'react';
import { Mic, MicOff, Send, ArrowLeft, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sender: 'user' }]);
      setMessage('');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "I'll help you create that document. Please provide more details about what you need.",
            sender: 'ai',
          },
        ]);
      }, 1000);
    }
  };

  const handleVoiceClick = () => {
    setShowVoiceModal(true);
  };

  const handleStartListening = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      setShowVoiceModal(false);
      setMessage('I need to create a professional resume for a software developer position');
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
              messages.map((msg, index) => (
                <motion.div
                  key={index}
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
              ))
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
                      isListening
                        ? 'bg-red-100 dark:bg-red-900'
                        : 'bg-indigo-100 dark:bg-indigo-900'
                    }`}
                  >
                    <motion.div
                      animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {isListening ? (
                        <MicOff className='w-10 h-10 text-red-600' />
                      ) : (
                        <Mic className='w-10 h-10 text-indigo-600' />
                      )}
                    </motion.div>
                  </div>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {isListening ? 'Listening...' : 'Voice Input'}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {isListening
                      ? "Speak now, I'm listening to your request"
                      : 'Click to start speaking in English or Odia'}
                  </p>
                </div>

                <div className='flex space-x-3'>
                  <button
                    type='button'
                    onClick={() => setShowVoiceModal(false)}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type='button'
                    onClick={handleStartListening}
                    disabled={isListening}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                    }`}
                  >
                    {isListening ? 'Stop' : 'Start Speaking'}
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
