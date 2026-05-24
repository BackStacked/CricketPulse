'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Globe } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { MODEL_METRICS, PROJECT_INFO } from '@/lib/constants'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

export function DocsHero() {
  return (
    <motion.section
      className="pb-12 border-b border-background-border"
      variants={container}
      initial="hidden"
      animate="show"
      aria-labelledby="docs-hero-title"
    >
      {/* GDG Badge */}
      <motion.div variants={item}>
        <span className="inline-flex items-center px-3 py-1 text-xs font-mono font-medium tracking-widest text-accent-primary border border-accent-primary/30 bg-accent-primary/5 rounded w-fit mb-6">
          {PROJECT_INFO.event} · {PROJECT_INFO.date}
        </span>
      </motion.div>

      {/* Title */}
      <motion.h1
        id="docs-hero-title"
        className="text-5xl font-bold tracking-tight text-text-primary mb-3"
        variants={item}
      >
        {PROJECT_INFO.name}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-xl text-text-secondary font-normal mb-4"
        variants={item}
      >
        Real-time Multi-Agent IPL Intelligence Platform
      </motion.p>

      {/* Description */}
      <motion.p
        className="text-sm leading-7 text-text-secondary max-w-2xl mb-8"
        variants={item}
      >
        CricketPulse is an event-driven backend that transforms every IPL ball into three simultaneous
        AI outputs — win probability from a custom XGBoost model, LLM commentary grounded in real data,
        and autonomous milestone alerts. Built in {PROJECT_INFO.buildWindow} at GDG Raipur&apos;s
        Agentic Premier League hackathon.
      </motion.p>

      {/* Stats row */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
        variants={item}
      >
        <StatCard label="Model Accuracy" value={MODEL_METRICS.accuracy} accentClass="border-l-accent-purple" />
        <StatCard label="ROC-AUC Score" value={MODEL_METRICS.roc_auc} accentClass="border-l-accent-primary" />
        <StatCard label="ML Inference" value={MODEL_METRICS.inferenceTime} accentClass="border-l-accent-green" />
        <StatCard label="AI Agents" value="3" accentClass="border-l-accent-amber" />
      </motion.div>

      {/* Buttons */}
      <motion.div className="flex flex-wrap gap-3" variants={item}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-white text-sm font-medium rounded-lg hover:bg-accent-primary/90 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary"
        >
          <ExternalLink size={14} aria-hidden="true" />
          View Live Dashboard
        </Link>
        <a
          href={PROJECT_INFO.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-background-raised border border-background-border text-sm font-medium text-text-secondary rounded-lg hover:text-text-primary hover:border-text-muted transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-primary"
        >
          <Globe size={14} aria-hidden="true" />
          GitHub
        </a>
      </motion.div>
    </motion.section>
  )
}
