import { useState } from 'react'
import SimulationTrigger from './components/SimulationTrigger.jsx'
import PolicyEngine from './components/PolicyEngine.jsx'
import AuthenticationGateway from './components/AuthenticationGateway.jsx'
import ThreatPipeline from './components/ThreatPipeline.jsx'
import XAIThreatDiagnostic from './components/XAIThreatDiagnostic.jsx'
import { SIMULATION_SCENARIOS } from './data/simulationScenarios.js'
import { calculateRisk, deriveRiskFactors } from './utils/riskEngine.js'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [mediumThreshold, setMediumThreshold] = useState(0.35)
  const [highThreshold, setHighThreshold] = useState(0.70)
  const [isSimModalOpen, setIsSimModalOpen] = useState(false)
  const [currentSim, setCurrentSim] = useState(SIMULATION_SCENARIOS[0])

  const { pvf, ucr } = deriveRiskFactors(currentSim)
  const risk = calculateRisk(pvf, ucr, mediumThreshold, highThreshold, currentSim.resourceSensitivity)

  const [securityStats, setSecurityStats] = useState({
    totalThreats: 248,
    detectedThreats: 231,
    containedThreats: 219,
    blockedThreats: 205
  })
  const [threatHistory, setThreatHistory] = useState([22, 35, 28, 42, 38, 31, 35])

  const handleExecuteSimulation = (newSim) => {
    setCurrentSim(newSim)
    setSecurityStats((prev) => ({
      ...prev,
      totalThreats: prev.totalThreats + 1,
      detectedThreats: prev.detectedThreats + 1,
      containedThreats: prev.containedThreats + (risk.decision !== 'ALLOW' ? 1 : 0),
      blockedThreats: prev.blockedThreats + (risk.decision === 'QUARANTINE_AND_BLOCK' ? 1 : 0)
    }))
    setThreatHistory((prev) => [...prev.slice(1), Math.round(newSim.payloadThreatScore * 45)])
  }

  const detectionRate = ((securityStats.detectedThreats / securityStats.totalThreats) * 100).toFixed(1)
  const containmentRate = ((securityStats.containedThreats / securityStats.detectedThreats) * 100).toFixed(1)
  const blockingEffectiveness = ((securityStats.blockedThreats / securityStats.detectedThreats) * 100).toFixed(1)

  const isHighRisk = risk.decision === 'QUARANTINE_AND_BLOCK'
  const isMediumRisk = risk.decision === 'STEP_UP_MFA'
  const riskColor = isHighRisk ? 'text-red-400' : isMediumRisk ? 'text-amber-400' : 'text-green-400'
  const riskBorder = isHighRisk ? 'border-red-500' : isMediumRisk ? 'border-amber-500' : 'border-green-500'

  const threatActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Live'],
    datasets: [
      {
        label: 'Detected Threats',
        data: threatHistory,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        fill: true,
        tension: 0.3
      }
    ]
  }

  const riskDistributionData = {
    labels: ['Low Risk', 'Medium Risk', 'High Risk'],
    datasets: [
      {
        data: [
          112 + (risk.decision === 'ALLOW' ? 1 : 0),
          84 + (risk.decision === 'STEP_UP_MFA' ? 1 : 0),
          52 + (risk.decision === 'QUARANTINE_AND_BLOCK' ? 1 : 0)
        ],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
        borderColor: '#0f172a',
        borderWidth: 3
      }
    ]
  }

  const threatResponseData = {
    labels: ['Detected', 'Contained', 'Blocked'],
    datasets: [
      {
        label: 'Security Events',
        data: [securityStats.detectedThreats, securityStats.containedThreats, securityStats.blockedThreats],
        backgroundColor: ['#3b82f6', '#f59e0b', '#22c55e'],
        borderRadius: 4
      }
    ]
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
      <SimulationTrigger
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        currentSim={currentSim}
        onExecuteSimulation={handleExecuteSimulation}
      />

      <header className="mb-6 flex flex-wrap items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold">🛡️ ZeroTrust-SME Shield</h1>
          <p className="text-xs text-slate-400">Zero-Trust Continuous Verification Control Center</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSimModalOpen(true)}
            className="rounded bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500"
          >
            ⚡ Trigger Simulation Vector
          </button>
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Admin: User
          </div>
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-4 border-b border-slate-800 pb-3 text-xs">
        {[
          { id: 'dashboard', label: 'Executive Dashboard' },
          { id: 'diagnostics', label: 'XAI Diagnostics' },
          { id: 'pipeline', label: 'Threat Pipeline' },
          { id: 'policy', label: 'Policy Engine' },
          { id: 'gateway', label: 'Access Gateway' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCurrentPage(tab.id)}
            className={`pb-1 transition-colors ${
              currentPage === tab.id ? 'border-b-2 border-blue-500 font-bold text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {currentPage === 'diagnostics' && (
        <XAIThreatDiagnostic
          onNavigate={setCurrentPage}
          mediumThreshold={mediumThreshold}
          highThreshold={highThreshold}
          currentSim={currentSim}
        />
      )}

      {currentPage === 'pipeline' && <ThreatPipeline onNavigate={setCurrentPage} />}

      {currentPage === 'policy' && (
        <PolicyEngine
          onNavigate={setCurrentPage}
          mediumThreshold={mediumThreshold}
          highThreshold={highThreshold}
          onSaveThresholds={(m, h) => {
            setMediumThreshold(m)
            setHighThreshold(h)
          }}
        />
      )}

      {currentPage === 'gateway' && (
        <AuthenticationGateway onNavigate={setCurrentPage} currentSim={currentSim} risk={risk} />
      )}

      {currentPage === 'dashboard' && (
        <main className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Active Scenario</span>
              <h2 className="text-base font-bold text-white">{currentSim.name}</h2>
              <p className="text-xs text-slate-400">
                Target: <span className="font-mono text-slate-300">{currentSim.targetResource}</span> (Sensitivity: <span className="text-amber-400">{currentSim.resourceSensitivity}</span>)
              </p>
            </div>
            <button
              onClick={() => setIsSimModalOpen(true)}
              className="rounded border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700"
            >
              Switch Vector
            </button>
          </div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">Total Threats</p>
              <p className="mt-2 text-2xl font-bold">{securityStats.totalThreats}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">Detected</p>
              <p className="mt-2 text-2xl font-bold text-blue-400">{securityStats.detectedThreats}</p>
              <p className="mt-1 text-[11px] text-blue-400">{detectionRate}%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">Contained</p>
              <p className="mt-2 text-2xl font-bold text-amber-400">{securityStats.containedThreats}</p>
              <p className="mt-1 text-[11px] text-amber-400">{containmentRate}%</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">Blocking Rate</p>
              <p className="mt-2 text-2xl font-bold text-green-400">{blockingEffectiveness}%</p>
              <p className="mt-1 text-[11px] text-green-400">{securityStats.blockedThreats} blocked</p>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-xs font-semibold uppercase text-slate-400">Live Threat Trend</h3>
              <div className="mt-3 h-52">
                <Line data={threatActivityData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <h3 className="text-xs font-semibold uppercase text-slate-400">Threat Response Statistics</h3>
              <div className="mt-3 h-52">
                <Bar data={threatResponseData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">PVF (60%)</p>
              <p className="mt-1 text-2xl font-bold">{pvf.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">UCR (40%)</p>
              <p className="mt-1 text-2xl font-bold">{ucr.toFixed(2)}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
              <p className="text-xs text-slate-400">Asset Sensitivity</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">{risk.multiplier.toFixed(2)}x</p>
            </div>
          </section>

          <section className={`rounded-xl border ${riskBorder} bg-slate-900 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4`}>
            <div>
              <p className="text-xs text-slate-400 font-bold">COMPOSITE RISK INDEX (Rc)</p>
              <p className={`mt-1 text-3xl font-bold ${riskColor}`}>{risk.rc.toFixed(2)}</p>
            </div>
            <div className="md:text-right">
              <p className="text-xs text-slate-400 font-bold">POLICY DIRECTIVE</p>
              <p className={`mt-1 text-lg font-bold ${riskColor}`}>{risk.decision.replaceAll('_', ' ')}</p>
              <div className="mt-2 flex flex-wrap gap-1.5 md:justify-end">
                {risk.directives.map((dir) => (
                  <span key={dir} className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                    {dir}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  )
}