'use client'

import { useCallback } from 'react'
import {
  BookOpen, GitBranch, Brain, Code2, Layers,
  Clock, Play, User, FileText, LayoutDashboard,
} from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview',      label: 'Overview',       icon: BookOpen },
  { id: 'architecture',  label: 'Architecture',   icon: GitBranch },
  { id: 'ml-model',      label: 'ML Model',       icon: Brain },
  { id: 'api',           label: 'API Reference',  icon: Code2 },
  { id: 'tech-stack',    label: 'Tech Stack',     icon: Layers },
  { id: 'sprint-plan',   label: 'Sprint Plan',    icon: Clock },
  { id: 'demo-script',   label: 'Demo Script',    icon: Play },
  { id: 'team',          label: 'About / Team',   icon: User },
  { id: 'prd',           label: 'PRD',            icon: FileText },
]

interface DocsSidebarProps {
  activeSection: string
}

export function DocsSidebar({ activeSection }: DocsSidebarProps) {
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <nav aria-label="Documentation sections">
      <div className="flex items-center gap-2 mb-6 px-3">
        <LayoutDashboard size={16} className="text-accent-primary" aria-hidden="true" />
        <span className="font-mono text-sm font-bold text-text-primary">
          Cricket<span className="text-accent-primary">Pulse</span>
        </span>
      </div>

      <p className="text-xs uppercase tracking-widest text-text-muted px-3 mb-3 font-medium">
        Documentation
      </p>

      <ul className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id
          return (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={[
                  'w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-r-lg border-l-2 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-accent-primary',
                  isActive
                    ? 'text-accent-primary border-accent-primary bg-background-raised'
                    : 'text-text-muted border-transparent hover:text-text-secondary hover:bg-background-raised',
                ].join(' ')}
                aria-current={isActive ? 'location' : undefined}
              >
                <Icon size={14} aria-hidden="true" />
                <span>{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
