"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EncryptedTextProps {
  text: string;
  encryptedClassName?: string;
  revealedClassName?: string;
  revealDelayMs?: number;
  className?: string;
}

const chars = "!@#$%^&*()_+-=[]{}|;:',.<>/?";

export const EncryptedText: React.FC<EncryptedTextProps> = ({
  text,
  encryptedClassName = "text-neutral-500",
  revealedClassName = "text-black dark:text-white",
  revealDelayMs = 50,
  className,
}) => {
  const [revealedIndex, setRevealedIndex] = useState(0);
  const [randomChars, setRandomChars] = useState<string[]>([]);

  useEffect(() => {
    // Initial random chars
    setRandomChars(
      Array.from({ length: text.length }, () => chars[Math.floor(Math.random() * chars.length)])
    );

    // Periodically update the unrevealed characters to look like scrambling
    const scrambleInterval = setInterval(() => {
      setRandomChars(
        Array.from({ length: text.length }, () => chars[Math.floor(Math.random() * chars.length)])
      );
    }, 50);

    // Progressively reveal the true characters
    const revealInterval = setInterval(() => {
      setRevealedIndex((prev) => {
        if (prev < text.length) {
          return prev + 1;
        } else {
          clearInterval(revealInterval);
          clearInterval(scrambleInterval);
          return prev;
        }
      });
    }, revealDelayMs);

    return () => {
      clearInterval(revealInterval);
      clearInterval(scrambleInterval);
    };
  }, [text, revealDelayMs]);

  return (
    <span className={cn("inline-block", className)}>
      {text.split("").map((char, index) => {
        const isRevealed = index < revealedIndex;
        // Don't scramble spaces to keep the word structure stable
        const displayChar = isRevealed || char === " " ? char : (randomChars[index] || chars[0]);

        return (
          <motion.span
            key={`${index}-${char}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1, delay: index * 0.01 }}
            className={isRevealed ? revealedClassName : encryptedClassName}
          >
            {displayChar}
          </motion.span>
        );
      })}
    </span>
  );
};
