import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // stagger delay in ms
  duration?: number;
  threshold?: number;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 25,
  duration = 0.5,
  threshold = 0.15,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const words = text.split(' ');

  const letterVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring' as const, damping: 14, stiffness: 100 }
    }
  };

  return (
    <span ref={ref} className={`inline-block ${className}`} aria-label={text}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap mr-2.5 last:mr-0">
          {word.split('').map((char, charIdx) => {
            // Calculate a running index of characters for staggered delay
            const precedingWordsLength = words.slice(0, wordIdx).join('').length;
            const index = precedingWordsLength + charIdx;
            return (
              <motion.span
                key={charIdx}
                variants={letterVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                transition={{
                  delay: (index * delay) / 1000,
                  duration: duration,
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
