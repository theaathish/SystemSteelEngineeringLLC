"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipWordsProps {
  words: string[];
  duration?: number;
  className?: string;
}

export const FlipWords: React.FC<FlipWordsProps> = ({
  words,
  duration = 3000,
  className,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      setIsAnimating(false);
    }, 700); // Duration should match the animation duration
  }, [words.length]);

  useEffect(() => {
    if (!isAnimating) {
      const wordInterval = setInterval(() => {
        startAnimation();
      }, duration);
      return () => clearInterval(wordInterval);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <div className={`relative inline-block overflow-hidden ${className}`}>
      <AnimatePresence>
        <motion.span
          key={currentWordIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.7 }}
          className="absolute left-0 top-0 w-full flex justify-center text-3xl no-underline"
        >
          {words[currentWordIndex]}
        </motion.span>
      </AnimatePresence>
      <span className="absolute bottom-0 left-0 h-0.5 bg-white w-full"></span>
    </div>
  );
};

export default FlipWords;
