import { useState } from 'react'
import { calculateRisk } from '../utils/riskEngine.js'

export default function PolicyEngine({
  onNavigate,
  mediumThreshold: savedMediumThreshold = 0.35,
  highThreshold: savedHighThreshold = 0.70,
  onSaveThresholds
}) {
  const DEFAULT_MEDIUM = 0.35
  const DEFAULT_HIGH = 0.70

  const [mediumThreshold, setMediumThreshold] = useState(savedMediumThreshold)
  const [highThreshold, setHighThreshold] = useState(savedHighThreshold)
  const [message, setMessage] = useState('')

  const thresholdsValid =
    Number.isFinite(mediumThreshold) &&
    Number.isFinite(highThreshold) &&
    mediumThreshold >= 0 &&
    highThreshold <= 1 &&
    mediumThreshold < highThreshold

  let sampleRisk = null
  if (thresholdsValid) {
    try {
      sampleRisk = calculateRisk(0.85, 0.40, mediumThreshold, highThreshold, 'HIGH')
    } catch {
      sampleRisk = null
    }
  }

  const formatValue = (value) => (Number.isFinite(value) ? value.toFixed(2) : 'Invalid')

  const handleSave = () => {
    if (!thresholdsValid) {
      setMessage('Invalid thresholds. Medium risk must be lower than high risk.')
      return
    }
    if (onSaveThresholds) {
      onSaveThresholds(mediumThreshold, highThreshold)
    }
    setMessage('Policy matrix saved successfully. Dashboard updated.')
  }

  const handleReset = () => {
    setMediumThreshold(DEFAULT_MEDIUM)
    setHighThreshold(DEFAULT_HIGH)
    if (onSaveThresholds) {
      onSaveThresholds(DEFAULT_MEDIUM, DEFAULT_HIGH)
    }
    setMessage('Default NIST SP 800-207 thresholds restored.')
  }

  const getDecisionStyle = () => {
    if (!sampleRisk) return 'border-slate-700 bg-slate-800 text-slate-300'
    if (sampleRisk.decision === 'QUARANTINE_AND_BLOCK') return 'border-red-500/30 bg-red-500/10 text-red-400'
    if (sampleRisk.decision === 'STEP_UP_MFA') return 'border-amber-500/30 bg-amber-500/10 text-amber-400'
    return 'border-green-500/30 bg-green-500/10 text-green-400'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500">POLICY DECISION ENGINE</p>
          <h2 className="mt-1 text-2xl font-bold text-white">PDE Configuration</h2>
          <p className="mt-1 text-xs text-slate-400">
            Configure risk thresholds and access enforcement rules compliant with NIST SP 800-207.
          </p>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
        >
          Back to Dashboard
        </button>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Risk Score Calculation Formula
        </h3>
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
          <p className="font-mono text-lg text-blue-400">Rc = (0.6 × PVF) + (0.4 × UCR)</p>
          <p className="mt-2 text-xs text-slate-400">
            High Asset Sensitivity Multiplier: <span className="font-bold text-amber-400">1.25x</span>
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Dynamic Risk Thresholds
        </h3>
        <p className="mb-6 text-xs text-slate-400">
          Control when access is allowed, additional MFA is required, or access is blocked.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-5">
            <label className="text-xs text-slate-400">Medium Risk Cutoff</label>
            <p className="mt-2 text-3xl font-bold text-amber-400">{formatValue(mediumThreshold)}</p>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={Number.isFinite(mediumThreshold) ? mediumThreshold : ''}
              onChange={(e) => {
                setMediumThreshold(e.target.value === '' ? NaN : Number(e.target.value))
                setMessage('')
              }}
              className="mt-4 w-full rounded border border-slate-600 bg-slate-900 p-2 text-sm text-white"
            />
            <input
              type="range"
              min="0"
              max="0.99"
              step="0.01"
              value={Number.isFinite(mediumThreshold) ? Math.min(0.99, Math.max(0, mediumThreshold)) : 0}
              onChange={(e) => {
                setMediumThreshold(Number(e.target.value))
                setMessage('')
              }}
              className="mt-3 w-full accent-amber-500"
            />
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-5">
            <label className="text-xs text-slate-400">High Risk Cutoff</label>
            <p className="mt-2 text-3xl font-bold text-red-400">{formatValue(highThreshold)}</p>
            <input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={Number.isFinite(highThreshold) ? highThreshold : ''}
              onChange={(e) => {
                setHighThreshold(e.target.value === '' ? NaN : Number(e.target.value))
                setMessage('')
              }}
              className="mt-4 w-full rounded border border-slate-600 bg-slate-900 p-2 text-sm text-white"
            />
            <input
              type="range"
              min="0.01"
              max="1"
              step="0.01"
              value={Number.isFinite(highThreshold) ? Math.min(1, Math.max(0.01, highThreshold)) : 0.70}
              onChange={(e) => {
                setHighThreshold(Number(e.target.value))
                setMessage('')
              }}
              className="mt-3 w-full accent-red-500"
            />
          </div>
        </div>

        {!thresholdsValid && (
          <p className="mt-4 rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
            Invalid settings: medium threshold must be lower than high threshold and between 0.0 and 1.0.
          </p>
        )}

        <div className="mt-6">
          <h4 className="mb-3 text-xs font-semibold uppercase text-slate-400">Current Risk Classification</h4>
          <div className="grid grid-cols-3 overflow-hidden rounded-lg">
            <div className="bg-green-500/20 p-3 text-center">
              <p className="text-xs font-bold text-green-400">ALLOW</p>
              <p className="mt-1 text-[11px] text-slate-300">0.00 – {formatValue(mediumThreshold - 0.01)}</p>
            </div>
            <div className="bg-amber-500/20 p-3 text-center">
              <p className="text-xs font-bold text-amber-400">STEP-UP MFA</p>
              <p className="mt-1 text-[11px] text-slate-300">
                {formatValue(mediumThreshold)} – {formatValue(highThreshold - 0.01)}
              </p>
            </div>
            <div className="bg-red-500/20 p-3 text-center">
              <p className="text-xs font-bold text-red-400">QUARANTINE & BLOCK</p>
              <p className="mt-1 text-[11px] text-slate-300">{formatValue(highThreshold)} – 1.00</p>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
          <h4 className="text-xs font-semibold text-slate-300">Live Policy Preview (PVF = 0.85, UCR = 0.40, Asset = HIGH)</h4>
          {sampleRisk && (
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Preview Composite Risk</p>
                <p className="mt-1 text-2xl font-bold">{sampleRisk.rc.toFixed(2)}</p>
              </div>
              <div className={`rounded-lg border px-4 py-2 text-xs font-bold ${getDecisionStyle()}`}>
                {sampleRisk.decision.replaceAll('_', ' ')}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Active Enforcement Directives
        </h3>
        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-3 rounded bg-slate-800/50 p-3">
            <span className="text-green-400">✓</span>
            <p>Force Phishing-Resistant FIDO2 WebAuthn for Medium Risk</p>
          </div>
          <div className="flex items-center gap-3 rounded bg-slate-800/50 p-3">
            <span className="text-green-400">✓</span>
            <p>Terminate Active OAuth Session Tokens for High Risk</p>
          </div>
          <div className="flex items-center gap-3 rounded bg-slate-800/50 p-3">
            <span className="text-green-400">✓</span>
            <p>Isolate Cloud Storage Sync (Block Lateral Movement)</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          disabled={!thresholdsValid}
          className="rounded bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-40"
        >
          Save Policy Matrix
        </button>
        <button
          onClick={handleReset}
          className="rounded border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
        >
          Reset to NIST SP 800-207 Defaults
        </button>
      </div>

      {message && (
        <p className={`text-xs ${message.includes('Invalid') ? 'text-red-400' : 'text-green-400'}`}>
          {message}
        </p>
      )}
    </div>
  )
}