import express from 'express';
import cors from 'cors';
import { evaluateZeroTrustAccess } from './riskCalculator.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

let activeThresholds = {
  mediumThreshold: 0.35,
  highThreshold: 0.70
};

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'ZeroTrust-SME Policy Decision Engine' });
});

// REST Endpoint specified in Section 3.2.3
app.post('/api/v1/zerotrust/evaluate-risk', (req, res) => {
  const {
    userId,
    deviceId,
    sourceIp,
    targetResource,
    resourceSensitivity,
    payloadTelemetry
  } = req.body;

  const decisionResult = evaluateZeroTrustAccess(
    { userId, deviceId, sourceIp, targetResource, resourceSensitivity },
    payloadTelemetry || {},
    activeThresholds
  );

  res.status(200).json(decisionResult);
});

app.listen(PORT, () => {
  console.log(`🛡️  Backend Policy Decision Engine running on http://localhost:${PORT}`);
});