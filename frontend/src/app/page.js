'use client';

import { useState, useEffect } from 'react';
import { Github, Linkedin, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const animatedWords = [
  'Draft Documents',
  'Generate PDFs',
  'Create Reports',
  'Transcribe Conversations',
  'Simplify Paperwork',
];

// Updated gradient colors for better visual appeal
const gradientColors = [
  'from-indigo-600 to-purple-600',
  'from-purple-600 to-pink-600',
  'from-pink-600 to-rose-600',
  'from-emerald-600 to-teal-600',
  'from-amber-600 to-orange-600',
  'from-red-600 to-pink-600',
];

export default function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % animatedWords.length);
      setCurrentColorIndex((prev) => (prev + 1) % gradientColors.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Function to split words into two lines for mobile
  const splitWordsForMobile = (text) => {
    const words = text.split(' ');
    if (words.length === 2) {
      return [words[0], words[1]];
    }
    // For words with more than 2 parts, split roughly in half
    const midPoint = Math.ceil(words.length / 2);
    return [words.slice(0, midPoint).join(' '), words.slice(midPoint).join(' ')];
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Navbar */}
      <nav className='flex items-center justify-between px-6 sm:px-8 lg:px-16 xl:px-24 py-6'>
        <div
          className={`font-bold text-2xl sm:text-3xl transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          SpeechApp
        </div>

        <div className='flex items-center space-x-4'>
          <button
            type='button'
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full transition-colors duration-200 ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {darkMode ? <Sun className='w-6 h-6' /> : <Moon className='w-6 h-6' />}
          </button>

          <Link
            href='https://github.com'
            target='_blank'
            rel='noopener noreferrer'
            className={`transition-colors duration-200 ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Github className='w-6 h-6 sm:w-7 sm:h-7' />
          </Link>

          <Link
            href='https://linkedin.com'
            target='_blank'
            rel='noopener noreferrer'
            className={`transition-colors duration-200 ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Linkedin className='w-6 h-6 sm:w-7 sm:h-7' />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className='flex items-center justify-center min-h-[calc(100vh-120px)] px-6 sm:px-8 lg:px-16 xl:px-24'>
        <div className='text-center max-w-6xl mx-auto'>
          {/* Animated Headline */}
          <div className='mb-8 sm:mb-12'>
            {/* Desktop: Stacked vertically but centered with reduced gap */}
            <div className='hidden lg:block'>
              <div className='flex flex-col items-center justify-center space-y-2'>
                <span
                  className={`text-5xl xl:text-7xl font-bold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Speak to
                </span>
                <div className='relative min-h-[6rem] xl:min-h-[8rem] flex items-center justify-center overflow-visible'>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={currentWordIndex}
                      initial={{
                        rotateX: -90,
                        opacity: 0,
                      }}
                      animate={{
                        rotateX: 0,
                        opacity: 1,
                      }}
                      exit={{
                        rotateX: 90,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeInOut',
                      }}
                      className='flex items-center justify-center'
                      style={{
                        transformOrigin: 'center',
                        backfaceVisibility: 'hidden',
                      }}
                    >
                      <span
                        className={`text-5xl xl:text-7xl font-bold bg-gradient-to-r ${gradientColors[currentColorIndex]} bg-clip-text text-transparent leading-tight text-center`}
                      >
                        {animatedWords[currentWordIndex]}
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Tablet: Two lines with reduced gap */}
            <div className='hidden sm:block lg:hidden'>
              <div
                className={`text-4xl md:text-6xl font-bold mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Speak to
              </div>
              <div className='relative min-h-[4rem] md:min-h-[6rem] flex items-center justify-center overflow-visible px-2'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentWordIndex}
                    initial={{
                      rotateX: -90,
                      opacity: 0,
                    }}
                    animate={{
                      rotateX: 0,
                      opacity: 1,
                    }}
                    exit={{
                      rotateX: 90,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeInOut',
                    }}
                    className='flex items-center justify-center w-full'
                    style={{
                      transformOrigin: 'center',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <span
                      className={`text-3xl md:text-5xl font-bold bg-gradient-to-r ${gradientColors[currentColorIndex]} bg-clip-text text-transparent text-center leading-tight`}
                    >
                      {animatedWords[currentWordIndex]}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile: Two lines for both "Speak to" and animated words split into two lines */}
            <div className='block sm:hidden'>
              <div
                className={`text-4xl font-bold mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Speak to
              </div>
              <div className='relative min-h-[5rem] flex items-center justify-center overflow-visible px-2'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentWordIndex}
                    initial={{
                      rotateX: -90,
                      opacity: 0,
                    }}
                    animate={{
                      rotateX: 0,
                      opacity: 1,
                    }}
                    exit={{
                      rotateX: 90,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: 'easeInOut',
                    }}
                    className='flex flex-col items-center justify-center w-full space-y-1'
                    style={{
                      transformOrigin: 'center',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {splitWordsForMobile(animatedWords[currentWordIndex]).map((line, index) => (
                      <span
                        key={line}
                        className={`text-3xl font-bold bg-gradient-to-r ${gradientColors[currentColorIndex]} bg-clip-text text-transparent text-center leading-tight block`}
                      >
                        {line}
                      </span>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='space-y-6 sm:space-y-8'>
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Transform Your Voice Into Professional Documents
            </h1>

            <p
              className={`text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Speak naturally in English or Odia and watch as your words become perfectly formatted
              applications, documents, and content. No typing required – just speak and create.
            </p>

            <div className='pt-4 sm:pt-8'>
              <Link href='/chat'>
                <motion.button
                  type='button'
                  className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg sm:text-xl px-8 sm:px-12 py-3 sm:py-4 rounded-full shadow-lg'
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Get Started
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
