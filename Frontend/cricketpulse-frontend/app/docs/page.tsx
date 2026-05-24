'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LayoutDashboard } from 'lucide-react'
import { DocsSidebar } from '@/components/docs/DocsSidebar'
import { DocsHero } from '@/components/docs/DocsHero'
import { ArchitectureDiagram } from '@/components/docs/ArchitectureDiagram'
import { MLModelSection } from '@/components/docs/MLModelSection'
import { ApiReference } from '@/components/docs/ApiReference'
import { TechStackGrid } from '@/components/docs/TechStackGrid'
import { SprintPlanSection } from '@/components/docs/SprintPlanSection'
import { DemoScriptSection } from '@/components/docs/DemoScriptSection'
import { TeamSection } from '@/components/docs/TeamSection'
import { PRDSection } from '@/components/docs/PRDSection'
import { Divider } from '@/components/ui/Divider'

const SECTION_IDS = [
  'overview', 'architecture', 'ml-model', 'api',
  'tech-stack', 'sprint-plan', 'demo-script', 'team', 'prd',
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )

    const obs = observerRef.current
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })

    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background-base">
      {/* Top nav */}
      <nav className="border-b border-background-border px-4 py-3 flex items-center justify-between sticky top-0 bg-background-base/95 backdrop-blur-sm z-20">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-text-primary">
            Cricket<span className="text-accent-primary">Pulse</span>
          </span>
          <span className="text-xs text-text-muted font-mono">/ docs</span>
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors duration-150 focus-visible:outline focus-visible:outline-accent-primary rounded px-1"
        >
          <LayoutDashboard size={14} aria-hidden="true" />
          <span>Dashboard</span>
        </Link>
      </nav>

      <div className="lg:grid lg:grid-cols-[240px_1fr]">
        {/* Sidebar — sticky on desktop */}
        <aside className="hidden lg:block border-r border-background-border">
          <div className="sticky top-14 p-4 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
            <DocsSidebar activeSection={activeSection} />
          </div>
        </aside>

        {/* Content */}
        <main className="px-6 py-10 max-w-4xl space-y-2">
          <section id="overview" style={{ scrollMarginTop: '5rem' }}>
            <DocsHero />
          </section>

          <Divider />

          <section id="architecture" style={{ scrollMarginTop: '5rem' }}>
            <ArchitectureDiagram />
          </section>

          <Divider />

          <section id="ml-model" style={{ scrollMarginTop: '5rem' }}>
            <MLModelSection />
          </section>

          <Divider />

          <section id="api" style={{ scrollMarginTop: '5rem' }}>
            <ApiReference />
          </section>

          <Divider />

          <section id="tech-stack" style={{ scrollMarginTop: '5rem' }}>
            <TechStackGrid />
          </section>

          <Divider />

          <section id="sprint-plan" style={{ scrollMarginTop: '5rem' }}>
            <SprintPlanSection />
          </section>

          <Divider />

          <section id="demo-script" style={{ scrollMarginTop: '5rem' }}>
            <DemoScriptSection />
          </section>

          <Divider />

          <section id="team" style={{ scrollMarginTop: '5rem' }}>
            <TeamSection />
          </section>

          <Divider />

          <section id="prd" style={{ scrollMarginTop: '5rem' }}>
            <PRDSection />
          </section>

          {/* Footer */}
          <div className="pt-12 pb-8 text-center">
            <p className="text-xs text-text-muted font-mono">
              CricketPulse · GDG Raipur · Agentic Premier League · May 24 2026
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
