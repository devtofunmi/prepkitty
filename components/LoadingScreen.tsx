
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-white overflow-hidden"
    >
      {/* Background Ripple Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut"
            }}
            className="absolute w-64 h-64 border border-blue-500/5 rounded-full"
          />
        ))}
      </div>

      {/* Centered Logo */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <Image
            src="/prepkitty_logo.png"
            alt="PrepKitty Logo"
            width={200}
            height={70}
            className="relative z-10"
          />
          
          {/* Subtle Glow beneath logo */}
          <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full" />
        </motion.div>
        
        {/* Progress indicator */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 40 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="h-[1.5px] bg-blue-600/20 mt-10"
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
