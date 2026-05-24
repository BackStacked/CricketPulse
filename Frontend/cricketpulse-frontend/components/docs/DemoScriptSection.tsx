'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Play } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { DEMO_SCRIPT, JUDGE_QUESTIONS } from '@/lib/constants'

export function DemoScriptSection() {
  const [openQ, setOpenQ] = useState<number | null>(null)

  return (
    <section aria-labelledby="demo-title" className="space-y-8">
      <div>
        <SectionLabel icon={Play}>Demo</SectionLabel>
        <h2 id="demo-title" className="text-2xl font-semibold tracking-tight text-text-primary">
          3-Minute Demo Script
        </h2>
        <p className="text-sm text-text-secondary mt-2">
          Run through this with the judges. The order matters.
        </p>
      </div>

      {/* Timeline */}
      <div className="flex flex-col gap-4">
        {DEMO_SCRIPT.map((section) => (
          <div
            key={section.timestamp}
            className={[
              'border rounded-lg overflow-hidden',
              section.highlight
                ? 'border-accent-primary/30 bg-accent-primary/5'
                : 'border-background-border bg-background-surface',
            ].join(' ')}
          >
            <div className="flex items-start gap-4 p-4">
              {/* Timestamp */}
              <div className="shrink-0 text-right">
                <span className="font-mono text-xs text-text-muted tabular-nums">
                  {section.timestamp}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {section.badge && (
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                      {section.badge}
                    </span>
                  )}
                  <span className="text-sm font-semibold text-text-primary">
                    {section.title}
                  </span>
                </div>

                {section.timestamp === '0:00–0:20' || section.timestamp === '2:30–3:00' ? (
                  <blockquote className="border-l-4 border-accent-primary pl-4 text-sm italic text-text-secondary leading-7">
                    {section.content}
                  </blockquote>
                ) : section.highlight ? (
                  <p className="text-sm text-text-secondary leading-7">{section.content}</p>
                ) : section.timestamp === '1:30–2:00' ? (
                  <div className="bg-accent-purple/10 border border-accent-purple/20 rounded p-3">
                    <p className="text-sm text-text-secondary leading-7">{section.content}</p>
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary leading-7">{section.content}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Judge Q&A */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-4">
          Anticipated Judge Questions
        </h3>
        <div className="flex flex-col gap-2">
          {JUDGE_QUESTIONS.map((qa, i) => (
            <div key={i} className="border border-background-border rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenQ(openQ === i ? null : i)}
                aria-expanded={openQ === i}
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-background-surface hover:bg-background-raised transition-colors duration-150 focus-visible:outline focus-visible:outline-accent-primary"
              >
                <span className="text-sm font-medium text-text-primary pr-4">{qa.question}</span>
                <motion.div
                  animate={{ rotate: openQ === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <ChevronDown size={16} className="text-text-muted" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openQ === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 py-3 text-sm leading-7 text-text-secondary border-t border-background-border">
                      {qa.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
