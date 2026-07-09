"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  role: string;
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
      className="h-4 w-4 text-slate-700"
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
              className="flex absolute top-4 right-4 lg:hidden items-center justify-center bg-white rounded-full h-8 w-8 shadow-md z-50"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="w-full max-w-[480px] max-h-[90vh] flex flex-col bg-white rounded-3xl overflow-hidden shadow-2xl"
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
                      className="font-bold text-xl text-slate-900"
                    >
                      {active.name}
                    </motion.h3>
                    <motion.p
                      layoutId={`role-${active.name}-${id}`}
                      className="text-blue-600 font-medium text-sm mt-0.5"
                    >
                      {active.role}
                    </motion.p>
                  </div>
                  {/* Desktop close */}
                  <button
                    onClick={() => setActive(null)}
                    className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
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
                  <p className="text-slate-600 text-sm leading-relaxed">{active.bio}</p>

                  {active.skills.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {active.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100"
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
            className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-md shadow-xl p-6 flex flex-col items-center text-center hover:bg-slate-100/50 hover:shadow-2xl transition-all duration-300 cursor-pointer group"
          >
            <motion.div
              layoutId={`image-${member.name}-${id}`}
              className="w-24 h-24 rounded-full mb-5 border-2 border-slate-300/50 overflow-hidden relative shadow-inner"
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
              className="font-bold text-lg text-slate-900 mb-1"
            >
              {member.name}
            </motion.h3>
            <motion.p
              layoutId={`role-${member.name}-${id}`}
              className="text-sm font-medium text-blue-600 mb-4"
            >
              {member.role}
            </motion.p>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-500 transition-colors">
              View Profile ↗
            </span>
          </motion.div>
        ))}
      </div>
    </>
  );
}
