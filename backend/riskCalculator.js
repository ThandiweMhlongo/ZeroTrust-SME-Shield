export function evaluateZeroTrustAccess(
  userRequest,
  payloadTelemetry,
  thresholds = { mediumThreshold: 0.35, highThreshold: 0.70 }
) {
  // Step 1: Calculate Payload Vulnerability Factor (PVF)
  let pvf = payloadTelemetry.payloadThreatScore;
  if (!payloadTelemetry.dmarcPassed) {
    pvf = Math.max(payloadTelemetry.payloadThreatScore, 0.8);
  }

  // Step 2: Compute User Context Risk Score (UCR)
  const isDeviceCompliant = !userRequest.deviceId?.includes('unmanaged') &&
                            !userRequest.deviceId?.includes('non_compliant');
  
  const isGeoAnomalous = userRequest.sourceIp === '197.221.32.10' || 
                         userRequest.sourceIp?.startsWith('197.');

  let ucr = 0.0;
  if (!isDeviceCompliant) ucr += 0.4;
  if (isGeoAnomalous) ucr += 0.5;

  // Step 3: Determine Composite Risk Index (Rc)
  let rc = (0.6 * pvf) + (0.4 * ucr);

  // Step 4: Asset Sensitivity Multiplier
  if (userRequest.resourceSensitivity?.toUpperCase() === 'HIGH') {
    rc = rc * 1.25;
  }

  rc = Math.min(Number(rc.toFixed(2)), 1.0);

  // Step 5: Render Policy Decision
  let action;
  let enforcementDirectives = [];

  if (rc >= thresholds.highThreshold) {
    action = 'QUARANTINE_AND_BLOCK';
    enforcementDirectives = [
      'TERMINATE_ACTIVE_OAUTH_SESSIONS',
      `QUARANTINE_EMAIL_${payloadTelemetry.emailId || 'MSG'}`,
      'REQUIRE_FIDO2_REAUTH',
      'ISOLATE_CLOUD_STORAGE_SYNC'
    ];
  } else if (rc >= thresholds.mediumThreshold) {
    action = 'STEP_UP_MFA';
    enforcementDirectives = [
      'CHALLENGE_FIDO2_HARDWARE_KEY',
      'RESTRICT_LATERAL_SEGMENTS'
    ];
  } else {
    action = 'ALLOW';
    enforcementDirectives = [
      'GRANT_CONDITIONAL_ACCESS',
      'CONTINUOUS_BACKGROUND_MONITORING'
    ];
  }

  return {
    decisionId: `dec_${Math.floor(10000000 + Math.random() * 90000000)}`,
    timestamp: new Date().toISOString(),
    compositeRiskScore: rc,
    action,
    enforcementDirectives,
    breakdown: {
      pvf: Number(pvf.toFixed(2)),
      ucr: Number(ucr.toFixed(2)),
      isDeviceCompliant,
      isGeoAnomalous
    }
  };
}