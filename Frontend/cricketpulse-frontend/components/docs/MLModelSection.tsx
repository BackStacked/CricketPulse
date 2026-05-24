import { Brain } from 'lucide-react'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { StatCard } from '@/components/ui/StatCard'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { FEATURE_TABLE, MODEL_METRICS } from '@/lib/constants'

const INFERENCE_CODE = `prob = model.predict_proba([features])[0][1]
# Returns 0.673 → displayed as 67.3% in 0.3ms
# Features: 12 match-state variables, computed per ball`

export function MLModelSection() {
  return (
    <section aria-labelledby="ml-title" className="space-y-8">
      <div>
        <SectionLabel icon={Brain}>Machine Learning</SectionLabel>
        <h2 id="ml-title" className="text-2xl font-semibold tracking-tight text-text-primary">
          Win Probability Model
        </h2>
      </div>

      {/* Overview */}
      <div className="prose prose-sm max-w-none">
        <p className="text-sm leading-7 text-text-secondary">
          Custom XGBoost classifier trained on 10 years of IPL ball-by-ball data from Kaggle (260,430 samples).
          The model runs locally — <code className="font-mono text-accent-primary text-xs">predict_proba()</code> executes in microseconds,
          never the bottleneck. This grounds LLM commentary in real statistical context rather than hallucination.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Accuracy" value={MODEL_METRICS.accuracy} accentClass="border-l-accent-purple" />
        <StatCard label="ROC-AUC" value={MODEL_METRICS.roc_auc} accentClass="border-l-accent-primary" />
        <StatCard label="Log Loss" value={MODEL_METRICS.log_loss} accentClass="border-l-accent-amber" />
        <StatCard label="Training Samples" value={MODEL_METRICS.trainingSamples} accentClass="border-l-accent-green" />
      </div>

      {/* Feature table */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-4">Feature Importance</h3>
        <div className="bg-background-surface border border-background-border rounded-lg overflow-hidden">
          <table className="w-full text-sm" aria-label="ML model feature importance table">
            <thead>
              <tr className="border-b border-background-border">
                <th scope="col" className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-muted">Feature</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-muted">Type</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-muted hidden md:table-cell">Description</th>
                <th scope="col" className="text-left px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-muted">Importance</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_TABLE.map((f, i) => (
                <tr
                  key={f.name}
                  className={[
                    'border-b border-background-border last:border-b-0',
                    i === 0 ? 'bg-accent-primary/5' : 'hover:bg-background-raised',
                  ].join(' ')}
                >
                  <td className="px-4 py-3 font-mono text-xs text-text-primary">{f.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{f.type}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary hidden md:table-cell">{f.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-background-raised rounded overflow-hidden" aria-hidden="true">
                        <div
                          className="h-full bg-accent-purple rounded"
                          style={{ width: `${(f.importance / 25.3) * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-text-muted tabular-nums">{f.importance}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code snippet */}
      <div>
        <h3 className="text-base font-semibold text-text-primary mb-3">Inference</h3>
        <CodeBlock code={INFERENCE_CODE} language="python" />
      </div>
    </section>
  )
}
