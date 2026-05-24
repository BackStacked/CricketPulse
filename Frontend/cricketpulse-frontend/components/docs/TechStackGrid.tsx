import { SectionLabel } from '@/components/ui/SectionLabel'
import { Layers } from 'lucide-react'
import { TECH_STACK } from '@/lib/constants'

export function TechStackGrid() {
  return (
    <section aria-labelledby="tech-title" className="space-y-4">
      <div>
        <SectionLabel icon={Layers}>Technology</SectionLabel>
        <h2 id="tech-title" className="text-2xl font-semibold tracking-tight text-text-primary">
          Tech Stack
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {TECH_STACK.map((tech) => (
          <div
            key={tech.name}
            className={`bg-background-surface border border-background-border rounded-lg p-4 border-l-2 ${tech.accent} hover:bg-background-raised transition-colors duration-150`}
          >
            <SectionLabel>{tech.category}</SectionLabel>
            <p className="text-base font-semibold text-text-primary mb-1">{tech.name}</p>
            <p className="text-xs text-text-muted leading-relaxed">{tech.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
