// src/components/games/FeedbackMessage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, Lock } from 'lucide-react';

const FeedbackMessage = ({ type, message }) => {
  const getStyles = () => {
    switch(type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: <CheckCircle className="w-8 h-8 text-white" />,
          border: 'border-green-300'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-pink-500',
          icon: <XCircle className="w-8 h-8 text-white" />,
          border: 'border-red-300'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          icon: <Info className="w-8 h-8 text-white" />,
          border: 'border-blue-300'
        };
      case 'lock':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-indigo-500',
          icon: <Lock className="w-8 h-8 text-white" />,
          border: 'border-purple-300'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-500 to-gray-600',
          icon: <Info className="w-8 h-8 text-white" />,
          border: 'border-gray-300'
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.5 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.5 }}
      className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 ${styles.bg} text-white px-8 py-4 rounded-2xl shadow-2xl border-4 ${styles.border}`}
    >
      <div className="flex items-center space-x-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {styles.icon}
        </motion.div>
        <motion.span 
          className="text-2xl font-bold"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default FeedbackMessage;