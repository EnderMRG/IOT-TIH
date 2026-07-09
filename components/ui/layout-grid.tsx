"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import NextImage, { StaticImageData } from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────

export type Card = {
  id: number;
  content: React.ReactNode;
  className: string;
  thumbnail: StaticImageData | string;
};

// ── LayoutGrid ────────────────────────────────────────────────────────────────

export function LayoutGrid({ cards }: { cards: Card[] }) {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = useCallback((card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  }, [selected]);

  const handleOutsideClick = useCallback(() => {
    setLastSelected(selected);
    setSelected(null);
  }, [selected]);

  return (
    <div className="w-full h-full grid grid-cols-1 md:grid-cols-3 gap-4 relative">
      {cards.map((card) => (
        <div
          key={card.id}
          className={cn(card.className, "relative")}
        >
          <AnimatePresence>
            {selected?.id === card.id && (
              <SelectedCard
                selected={selected}
                onOutsideClick={handleOutsideClick}
              />
            )}
          </AnimatePresence>
          <BlurImage card={card} onClick={() => handleClick(card)} />
        </div>
      ))}

      {/* Global backdrop when a card is selected */}
      <AnimatePresence>
        {selected && (
          <motion.div
            onClick={handleOutsideClick}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 rounded-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── BlurImage — individual card thumbnail ─────────────────────────────────────

function BlurImage({ card, onClick }: { card: Card; onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl cursor-pointer h-60 md:h-72 bg-slate-900",
        "border border-white/10 hover:border-white/25 transition-colors duration-300"
      )}
      layoutId={`card-${card.id}`}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <NextImage
        src={card.thumbnail}
        alt={`Gallery photo ${card.id}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    </motion.div>
  );
}

// ── SelectedCard — expanded overlay ──────────────────────────────────────────

function SelectedCard({
  selected,
  onOutsideClick,
}: {
  selected: Card | null;
  onOutsideClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOutsideClick();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onOutsideClick]);

  return (
    <motion.div
      layoutId={`card-${selected?.id}`}
      className="absolute inset-0 rounded-2xl overflow-hidden z-[50] cursor-pointer"
      onClick={onOutsideClick}
      ref={ref}
    >
      {/* Full-bleed photo */}
      {selected?.thumbnail && (
        <NextImage
          src={selected.thumbnail}
          alt="Selected"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      )}
      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"
      />
      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute bottom-0 left-0 right-0 p-6"
      >
        {selected?.content}
      </motion.div>
      {/* Close hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5"
      >
        <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
        <span className="text-white text-xs font-medium">Close</span>
      </motion.div>
    </motion.div>
  );
}
