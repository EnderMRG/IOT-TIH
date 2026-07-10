"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role?: string;
  image: string;
  bio: string;
  skills: string[];
}

// ── Close icon ────────────────────────────────────────────────────────────────

function CloseIcon() {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-white"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ExpandableTeamCards({ members }: { members: TeamMember[] }) {
  const [active, setActive] = useState<TeamMember | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm h-full w-full z-40"
          />
        )}
      </AnimatePresence>

      {/* Expanded card */}
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-50 p-4">
            {/* Mobile close button */}
            <motion.button
              key={`close-btn-${active.name}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full h-8 w-8 shadow-md z-50"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="w-full max-w-[480px] max-h-[90vh] flex flex-col bg-slate-900/80 backdrop-blur-2xl border border-white/15 rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Photo */}
              <motion.div
                layoutId={`image-${active.name}-${id}`}
                className="relative w-full h-64 shrink-0"
              >
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  className="object-cover object-top"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </motion.div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.name}-${id}`}
                      className="font-bold text-xl text-white drop-shadow-sm"
                    >
                      {active.name}
                    </motion.h3>
                    {active.role && (
                      <motion.p
                        layoutId={`role-${active.name}-${id}`}
                        className="text-blue-300 font-medium text-sm mt-0.5 drop-shadow-sm"
                      >
                        {active.role}
                      </motion.p>
                    )}
                  </div>
                  {/* Desktop close */}
                  <button
                    onClick={() => setActive(null)}
                    className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <p className="text-white/80 text-sm leading-relaxed">{active.bio}</p>

                  {active.skills.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {active.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {members.map((member) => (
          <motion.div
            layoutId={`card-${member.name}-${id}`}
            key={`card-${member.name}-${id}`}
            onClick={() => setActive(member)}
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] rounded-3xl border border-white/15 bg-black/30 backdrop-blur-xl shadow-2xl p-6 flex flex-col items-center text-center hover:bg-white/10 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
          >
            <motion.div
              layoutId={`image-${member.name}-${id}`}
              className="w-24 h-24 rounded-full mb-5 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-white/10 overflow-hidden relative shadow-inner"
            >
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
            <motion.h3
              layoutId={`title-${member.name}-${id}`}
              className="font-bold text-lg text-white mb-1 drop-shadow-sm"
            >
              {member.name}
            </motion.h3>
            {member.role && (
              <motion.p
                layoutId={`role-${member.name}-${id}`}
                className="text-sm font-medium text-blue-300 mb-4 drop-shadow-sm"
              >
                {member.role}
              </motion.p>
            )}
            <span className={`text-xs font-semibold text-white/50 group-hover:text-blue-300 transition-colors ${!member.role ? 'mt-4' : ''}`}>
              View Profile ↗
            </span>
          </motion.div>
        ))}
      </div>
    </>
  );
}
