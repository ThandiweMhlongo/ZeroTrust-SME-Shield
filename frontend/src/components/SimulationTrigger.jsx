import { useState } from 'react'
import { SIMULATION_SCENARIOS } from '../data/simulationScenarios.js'

export default function SimulationTrigger({
  isOpen,
  onClose,
  currentSim,
  onExecuteSimulation
}) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(currentSim.id)
  const [dmarcPassed, setDmarcPassed] = useState(currentSim.dmarcPassed)
  const [isDeviceCompliant, setIsDeviceCompliant] = useState(currentSim.isDeviceCompliant)
  const [isGeoAnomalous, setIsGeoAnomalous] = useState(currentSim.isGeoAnomalous)
  const [resourceSensitivity, setResourceSensitivity] = useState(currentSim.resourceSensitivity)
  const [payloadThreatScore, setPayloadThreatScore] = useState(currentSim.payloadThreatScore)

  if (!isOpen) return null

  const handleScenarioChange = (e) => {
    const scenario = SIMULATION_SCENARIOS.find((s) => s.id === e.target.value)
    if (scenario) {
      setSelectedScenarioId(scenario.id)
      setDmarcPassed(scenario.dmarcPassed)
      setIsDeviceCompliant(scenario.isDeviceCompliant)
      setIsGeoAnomalous(scenario.isGeoAnomalous)
      setResourceSensitivity(scenario.resourceSensitivity)
      setPayloadThreatScore(scenario.payloadThreatScore)
    }
  }

  const handleRun = () => {
    const baseScenario = SIMULATION_SCENARIOS.find((s) => s.id === selectedScenarioId)
    onExecuteSimulation({
      ...baseScenario,
      dmarcPassed,
      isDeviceCompliant,
      isGeoAnomalous,
      resourceSensitivity,
      payloadThreatScore
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-xl font-bold text-white">⚡ Real-Time Simulation Trigger</h3>
            <p className="mt-1 text-xs text-slate-400">
              Inject synthetic attack vectors and live contextual telemetry into the Policy Engine
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-xs font-semibold tracking-wider text-slate-400">
              PRECONFIGURED ATTACK SCENARIO
            </label>
            <select
              value={selectedScenarioId}
              onChange={handleScenarioChange}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              {SIMULATION_SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>INTRINSIC THREAT SCORE (Sp)</span>
                <span className="font-mono text-blue-400">{payloadThreatScore.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={payloadThreatScore}
                onChange={(e) => setPayloadThreatScore(Number(e.target.value))}
                className="mt-3 w-full accent-blue-500"
              />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <label className="text-xs font-semibold text-slate-400">RESOURCE SENSITIVITY</label>
              <div className="mt-3 flex gap-2">
                {['LOW', 'HIGH'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setResourceSensitivity(level)}
                    className={`flex-1 rounded-md py-2 text-xs font-bold transition-colors ${
                      resourceSensitivity === level
                        ? 'bg-blue-600 text-white'
                        : 'border border-slate-700 bg-slate-900 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {level} {level === 'HIGH' ? '(1.25x)' : '(1.0x)'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400">
              CONTEXTUAL RISK SIGNALS (UCR & PVF GATES)
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs">
                <input
                  type="checkbox"
                  checked={dmarcPassed}
                  onChange={(e) => setDmarcPassed(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className={dmarcPassed ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                  DMARC Passed
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs">
                <input
                  type="checkbox"
                  checked={isDeviceCompliant}
                  onChange={(e) => setIsDeviceCompliant(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className={isDeviceCompliant ? 'text-green-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  Device Compliant
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 p-3 text-xs">
                <input
                  type="checkbox"
                  checked={isGeoAnomalous}
                  onChange={(e) => setIsGeoAnomalous(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className={isGeoAnomalous ? 'text-red-400 font-semibold' : 'text-green-400 font-semibold'}>
                  Geo Anomaly (+0.50)
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleRun}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500"
          >
            Execute Simulation Vector
          </button>
        </div>
      </div>
    </div>
  )
}