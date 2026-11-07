import { useMemo } from 'react'
import { ReactFlow, Background, Controls, MiniMap, MarkerType } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

export default function ThreatPipeline({ onNavigate }) {
  const nodes = useMemo(() => [
    {
      id: '1',
      position: { x: 50, y: 160 },
      data: { label: '📩 Incoming Email\nCloud API Ingestion' },
      style: { background: '#1e3a8a', color: '#fff', border: '1px solid #3b82f6', borderRadius: 8, padding: 12, width: 170, fontSize: 12, whiteSpace: 'pre-line' }
    },
    {
      id: '2',
      position: { x: 270, y: 160 },
      data: { label: '🔍 Ingestion Inspection\nSPF, DKIM, DMARC' },
      style: { background: '#334155', color: '#fff', border: '1px solid #64748b', borderRadius: 8, padding: 12, width: 180, fontSize: 12, whiteSpace: 'pre-line' }
    },
    {
      id: '3',
      position: { x: 500, y: 160 },
      data: { label: '🤖 AI Threat Engine\nDeBERTa-v3 & XGBoost' },
      style: { background: '#581c87', color: '#fff', border: '1px solid #a855f7', borderRadius: 8, padding: 12, width: 180, fontSize: 12, whiteSpace: 'pre-line' }
    },
    {
      id: '4',
      position: { x: 730, y: 160 },
      data: { label: '📊 Risk Formula\n(0.6*PVF) + (0.4*UCR)' },
      style: { background: '#713f12', color: '#fff', border: '1px solid #f59e0b', borderRadius: 8, padding: 12, width: 170, fontSize: 12, whiteSpace: 'pre-line' }
    },
    {
      id: '5',
      position: { x: 950, y: 160 },
      data: { label: '⚖️ Policy Decision (PDE)\nEvaluate Thresholds' },
      style: { background: '#164e63', color: '#fff', border: '1px solid #06b6d4', borderRadius: 8, padding: 12, width: 170, fontSize: 12, whiteSpace: 'pre-line' }
    },
    {
      id: '6',
      position: { x: 1190, y: 40 },
      data: { label: '✓ ALLOW\nLow Risk (Rc < 0.35)' },
      style: { background: '#14532d', color: '#fff', border: '1px solid #22c55e', borderRadius: 8, padding: 12, width: 160, fontSize: 12, whiteSpace: 'pre-line' }
    },
    {
      id: '7',
      position: { x: 1190, y: 160 },
      data: { label: '🔐 STEP-UP MFA\nMedium Risk (FIDO2)' },
      style: { background: '#78350f', color: '#fff', border: '1px solid #f59e0b', borderRadius: 8, padding: 12, width: 160, fontSize: 12, whiteSpace: 'pre-line' }
    },
    {
      id: '8',
      position: { x: 1190, y: 280 },
      data: { label: '⛔ QUARANTINE\nHigh Risk (Block Lateral)' },
      style: { background: '#7f1d1d', color: '#fff', border: '1px solid #ef4444', borderRadius: 8, padding: 12, width: 170, fontSize: 12, whiteSpace: 'pre-line' }
    }
  ], [])

  const edges = useMemo(() => [
    { id: '1-2', source: '1', target: '2', animated: true, style: { stroke: '#64748b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' } },
    { id: '2-3', source: '2', target: '3', animated: true, style: { stroke: '#64748b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' } },
    { id: '3-4', source: '3', target: '4', animated: true, style: { stroke: '#64748b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' } },
    { id: '4-5', source: '4', target: '5', animated: true, style: { stroke: '#64748b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' } },
    { id: '5-6', source: '5', target: '6', label: 'Low', animated: true, style: { stroke: '#22c55e' }, labelStyle: { fill: '#cbd5e1', fontSize: 11 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' } },
    { id: '5-7', source: '5', target: '7', label: 'Medium', animated: true, style: { stroke: '#f59e0b' }, labelStyle: { fill: '#cbd5e1', fontSize: 11 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
    { id: '5-8', source: '5', target: '8', label: 'High', animated: true, style: { stroke: '#ef4444' }, labelStyle: { fill: '#cbd5e1', fontSize: 11 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } }
  ], [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-slate-500">ZERO TRUST WORKFLOW</p>
          <h2 className="mt-1 text-2xl font-bold">Threat Pipeline Architecture</h2>
        </div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="h-[520px] w-full rounded-xl border border-slate-800 bg-slate-950 p-2">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background color="#334155" gap={20} />
          <Controls />
          <MiniMap nodeColor={(n) => n.style?.background || '#334155'} maskColor="rgba(15, 23, 42, 0.7)" />
        </ReactFlow>
      </div>
    </div>
  )
}