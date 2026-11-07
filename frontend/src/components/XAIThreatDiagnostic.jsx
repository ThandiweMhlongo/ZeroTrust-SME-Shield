import { calculateRisk, deriveRiskFactors } from '../utils/riskEngine.js'

export default function XAIThreatDiagnostic({
  onNavigate,
  mediumThreshold = 0.35,
  highThreshold = 0.70,
  currentSim
}) {
  const { pvf, ucr } = deriveRiskFactors(currentSim)
  const risk = calculateRisk(pvf, ucr, mediumThreshold, highThreshold, currentSim.resourceSensitivity)
  const sensitivityImpact = Math.max(0, risk.rc - risk.baseRisk)

  const features = [
    {
      name: 'Payload Vulnerability Factor (PVF)',
      value: pvf * 0.6,
      description: 'Language anomalies and structural domain checks contribute 60% of base risk.',
      color: 'bg-red-500'
    },
    {
      name: 'User Context Risk (UCR)',
      value: ucr * 0.4,
      description: 'Device compliance and IP geographic anomalies contribute 40% of base risk.',
      color: 'bg-amber-500'
    },
    {
      name: 'Target Asset Sensitivity Multiplier',
      value: sensitivityImpact,
      description: risk.multiplier > 1
        ? 'High sensitivity asset applies 1.25x upward multiplier.'
        : 'Baseline resource sensitivity: 1.0x multiplier.',
      color: 'bg-purple-500'
    }
  ]

  const riskColor = risk.decision === 'QUARANTINE_AND_BLOCK'
    ? 'text-red-400'
    : risk.decision === 'STEP_UP_MFA'
      ? 'text-amber-400'
      : 'text-green-400'

  const indicatorCards = [
    {
      title: 'Urgency & Pressure Markers',
      score: currentSim.urgencyScore.toFixed(2),
      status: currentSim.urgencyScore > 0.7 ? 'HIGH' : 'LOW',
      detail: 'Synthetic language model detected coercive action triggers in message body.',
      color: currentSim.urgencyScore > 0.7 ? 'text-red-400' : 'text-green-400'
    },
    {
      title: 'Domain Typosquatting Similarity',
      score: currentSim.typosquatScore.toFixed(2),
      status: currentSim.typosquatScore > 0.7 ? 'HIGH SIMILARITY' : 'BENIGN',
      detail: 'Levenshtein edit distance against registered SME vendor domains.',
      color: currentSim.typosquatScore > 0.7 ? 'text-red-400' : 'text-green-400'
    },
    {
      title: 'Email Header Authentication',
      score: currentSim.dmarcPassed ? 'DMARC PASS' : 'DMARC FAIL',
      status: currentSim.dmarcPassed ? 'VERIFIED' : 'SUSPICIOUS',
      detail: currentSim.dmarcPassed ? 'SPF and DKIM pass alignment checks.' : 'Envelope sender spoofed.',
      color: currentSim.dmarcPassed ? 'text-green-400' : 'text-red-400'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500">EXPLAINABLE AI DIAGNOSTICS</p>
          <h2 className="mt-1 text-2xl font-bold text-white">XAI Threat Diagnostic Panel</h2>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
        >
          Back to Dashboard
        </button>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h3 className="text-sm font-semibold uppercase text-slate-400">Inspected Message</h3>
        <p className="mt-2 text-lg font-bold">{currentSim.name}</p>
        <p className="mt-1 text-xs text-slate-400">Sender: {currentSim.sender}</p>
        <p className="text-xs text-slate-400">Subject: {currentSim.subject}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {indicatorCards.map((ind) => (
          <div key={ind.title} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs text-slate-400">{ind.title}</p>
            <p className={`mt-2 text-2xl font-bold ${ind.color}`}>{ind.score}</p>
            <p className={`mt-1 text-xs font-bold ${ind.color}`}>{ind.status}</p>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">{ind.detail}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-sm font-semibold uppercase text-slate-400">SHAP-style Feature Contribution</h3>
        <div className="mt-4 space-y-4">
          {features.map((f) => (
            <div key={f.name}>
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-300">{f.name}</span>
                <span className="font-mono text-white">+{f.value.toFixed(3)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className={`h-full ${f.color}`} style={{ width: `${Math.min(f.value * 100, 100)}%` }}></div>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">DECISION</p>
          <p className={`text-xl font-bold ${riskColor}`}>{risk.decision.replaceAll('_', ' ')}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">COMPOSITE RISK (Rc)</p>
          <p className={`text-3xl font-bold ${riskColor}`}>{risk.rc.toFixed(2)}</p>
        </div>
      </section>
    </div>
  )
}