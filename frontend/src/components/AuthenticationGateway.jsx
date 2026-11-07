export default function AuthenticationGateway({ onNavigate, currentSim, risk }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Policy Enforcement Point (PEP) Gateway</h2>
        <button
          onClick={() => onNavigate('dashboard')}
          className="rounded border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/40 bg-amber-500/10 text-2xl">
          🛡️
        </div>
        <p className="text-xs font-bold tracking-[0.2em] text-blue-400">
          ZEROTRUST-SME SECURITY GUARD
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-amber-500/40 bg-slate-900 shadow-2xl">
        <div className="border-b border-amber-500/20 bg-amber-500/5 p-6 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-xl text-amber-400">
            ⚠
          </div>
          <h3 className="text-lg font-bold text-white">ATTENTION: ADDITIONAL VERIFICATION REQUIRED</h3>
          <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-400">
            Your request to access the protected resource exceeds the baseline security risk threshold.
          </p>
        </div>

        <div className="border-b border-slate-800 p-5">
          <p className="mb-2 text-[11px] font-semibold tracking-wider text-slate-500">PROTECTED RESOURCE</p>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-3 text-lg">📄</div>
            <div>
              <p className="font-semibold text-white">{currentSim.targetResource}</p>
              <p className="text-xs text-slate-500">SME Financial Cloud Repository</p>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-800 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500">CURRENT ACCESS RISK</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">MEDIUM</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-500">Composite Risk Index</p>
              <p className="mt-1 text-2xl font-bold text-amber-400">{risk.rc.toFixed(2)}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-xs space-y-1.5 text-slate-300">
            <p className="font-semibold text-slate-400 uppercase text-[10px]">Reason for Interception</p>
            <p><span className="mr-2 text-amber-400">●</span>Device: {currentSim.deviceId} ({currentSim.isDeviceCompliant ? 'Compliant' : 'Non-compliant'})</p>
            <p><span className="mr-2 text-amber-400">●</span>Source IP: {currentSim.sourceIp} ({currentSim.isGeoAnomalous ? 'Anomalous' : 'Normal'})</p>
            <p><span className="mr-2 text-amber-400">●</span>Recent payload threat score: {currentSim.payloadThreatScore.toFixed(2)}</p>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-5 text-center">
            <p className="text-[11px] font-semibold text-slate-500">PHISHING-RESISTANT AUTHENTICATION</p>
            <h4 className="mt-1 text-lg font-semibold">Verify Your Identity</h4>
            <p className="mt-1 text-xs text-slate-400">
              Insert your hardware security key, tap your FIDO2 token, or authenticate with a registered passkey.
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-blue-500/30 bg-blue-500/5 p-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-2xl">
              🔑
            </div>
            <p className="text-sm font-semibold text-white">Insert Hardware Security Key / Tap FIDO2 Token</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500"></span>
              <span className="text-xs font-semibold text-blue-400">WAITING FOR SECURITY KEY</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => alert('FIDO2 hardware assertion confirmed. Access granted to micro-segment.')}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500"
            >
              Verify Identity
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Cancel Request
            </button>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-slate-600">
        Zero Trust Policy Enforcement Point • FIDO2 / WebAuthn Security
      </p>
    </div>
  )
}