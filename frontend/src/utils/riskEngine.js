export function calculateRisk(
  pvf,
  ucr,
  mediumThreshold = 0.35,
  highThreshold = 0.70,
  resourceSensitivity = 'LOW'
) {
  const inputs = [pvf, ucr, mediumThreshold, highThreshold];

  if (!inputs.every(Number.isFinite)) {
    throw new Error('Risk values and thresholds must be valid numbers.');
  }

  if (
    pvf < 0 || pvf > 1 ||
    ucr < 0 || ucr > 1 ||
    mediumThreshold < 0 || mediumThreshold > 1 ||
    highThreshold < 0 || highThreshold > 1
  ) {
    throw new Error('Risk values and thresholds must be between 0 and 1.');
  }

  if (mediumThreshold >= highThreshold) {
    throw new Error('Medium threshold must be lower than high threshold.');
  }

  // Base weighted risk: Rc = (0.6 * PVF) + (0.4 * UCR)
  const baseRisk = (0.6 * pvf) + (0.4 * ucr);

  // High-sensitivity asset multiplier (1.25x)
  const multiplier = resourceSensitivity === 'HIGH' ? 1.25 : 1;

  // Composite risk score bounded to [0.0, 1.0]
  const rc = Math.min(Number((baseRisk * multiplier).toFixed(4)), 1.0);

  let decision;
  let directives = [];

  if (rc >= highThreshold) {
    decision = 'QUARANTINE_AND_BLOCK';
    directives = [
      'TERMINATE_ACTIVE_OAUTH_SESSIONS',
      'QUARANTINE_EMAIL_PAYLOAD',
      'BLOCK_SOURCE_IP_SUBNET',
      'ISOLATE_CLOUD_STORAGE_SYNC'
    ];
  } else if (rc >= mediumThreshold) {
    decision = 'STEP_UP_MFA';
    directives = [
      'REQUIRE_FIDO2_HARDWARE_KEY',
      'INITIATE_STEP_UP_WEBAUTHN',
      'RESTRICT_LATERAL_SEGMENTS'
    ];
  } else {
    decision = 'ALLOW';
    directives = [
      'ALLOW_TRANSACTION',
      'CONTINUOUS_BACKGROUND_MONITORING'
    ];
  }

  return {
    pvf: Number(pvf.toFixed(4)),
    ucr: Number(ucr.toFixed(4)),
    baseRisk: Number(baseRisk.toFixed(4)),
    rc,
    decision,
    multiplier,
    directives
  };
}

export function deriveRiskFactors(simulation) {
  let pvf = simulation.payloadThreatScore;
  if (!simulation.dmarcPassed) {
    pvf = Math.max(pvf, 0.8);
  }

  let ucr = 0.0;
  if (!simulation.isDeviceCompliant) ucr += 0.4;
  if (simulation.isGeoAnomalous) ucr += 0.5;

  return {
    pvf: Math.min(pvf, 1.0),
    ucr: Math.min(ucr, 1.0)
  };
}