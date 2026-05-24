import { Clock, CheckCircle } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { SPRINT_PLAN } from '@/lib/constants'

export function SprintPlanSection() {
  return (
    <section aria-labelledby="sprint-title" className="space-y-6">
      <div>
        <SectionLabel icon={Clock}>Timeline</SectionLabel>
        <h2 id="sprint-title" className="text-2xl font-semibold tracking-tight text-text-primary">
          Sprint Plan
        </h2>
        <p className="text-sm text-text-secondary mt-2">3.5-hour build window — GDG Raipur hackathon</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical dashed line */}
        <div
          className="absolute left-4 top-8 bottom-8 w-px border-l border-dashed border-background-border"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-4">
          {SPRINT_PLAN.map((sprint, i) => (
            <div key={sprint.number} className="flex gap-6">
              {/* Timeline dot */}
              <div className="flex flex-col items-center shrink-0" aria-hidden="true">
                <div className={`w-8 h-8 rounded-full border-2 bg-background-base flex items-center justify-center z-10 ${sprint.color.replace('border-', 'border-')}`}>
                  <span className="font-mono text-xs font-bold text-text-muted">{i + 1}</span>
                </div>
              </div>

              {/* Card */}
              <div className={`flex-1 bg-background-surface border border-background-border rounded-lg p-4 border-l-2 ${sprint.color} mb-2`}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">
                      Sprint {sprint.number} — {sprint.title}
                    </h3>
                    <p className="font-mono text-xs text-text-muted mt-0.5">{sprint.time}</p>
                  </div>
                </div>

                <ul className="flex flex-col gap-1.5 mb-4" aria-label={`Sprint ${sprint.number} tasks`}>
                  {sprint.tasks.map((task) => (
                    <li key={task} className="flex items-start gap-2">
                      <CheckCircle size={12} className="text-accent-green shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-xs text-text-secondary leading-relaxed">{task}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-3 border-t border-background-border">
                  <span className="text-xs text-text-muted">
                    <span className="font-medium text-text-secondary">Done when: </span>
                    {sprint.doneWhen}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
