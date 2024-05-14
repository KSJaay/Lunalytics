import { it } from 'vitest';
import {
  cleanPartialMonitor,
  cleanMonitor,
} from '../../../server/class/monitor';

describe('Monitor - Class', () => {
  const monitor = {
    monitorId: '4d048471-9e85-428b-8050-4238f6033478',
    name: 'Lunalytics',
    url: 'https://demo.lunalytics.xyz/api/status',
    interval: '30',
    retryInterval: '60',
    requestTimeout: '30',
    method: 'GET',
    headers: null,
    body: null,
    valid_status_codes: JSON.stringify(['200-299']),
    email: 'ksjaay@lunalytics.xyz',
    type: 'http',
    port: null,
    uptimePercentage: 100,
    averageHeartbeatLatency: 820,
  };

  const certificate = {
    isValid: true,
    issuer: JSON.stringify({ C: 'US', O: "Let's Encrypt", CN: 'R3' }),
    validFrom: 'Apr 15 01:56:22 2024 GMT',
    validTill: 'Jul 14 01:56:21 2024 GMT',
    validOn: JSON.stringify(['*.vercel.app', 'vercel.app']),
    daysRemaining: 62,
    lastCheck: 1715559831877,
    nextCheck: 1715646231877,
  };

  it('should return valid monitor using cleanPartialMonitor', () => {
    expect(cleanPartialMonitor(monitor)).toEqual({
      monitorId: '4d048471-9e85-428b-8050-4238f6033478',
      name: 'Lunalytics',
      url: 'https://demo.lunalytics.xyz/api/status',
      interval: 30,
      retryInterval: 60,
      requestTimeout: 30,
      method: 'GET',
      headers: null,
      body: null,
      valid_status_codes: ['200-299'],
      email: 'ksjaay@lunalytics.xyz',
      type: 'http',
      port: null,
      uptimePercentage: 100,
      averageHeartbeatLatency: 820,
    });
  });

  it('should return valid monitor using cleanMonitor', () => {
    expect(
      cleanMonitor({
        ...monitor,
        lastCheck: 1715559831877,
        nextCheck: 1715646231877,
        cert: certificate,
        heartbeats: [],
      })
    ).toEqual({
      monitorId: '4d048471-9e85-428b-8050-4238f6033478',
      name: 'Lunalytics',
      url: 'https://demo.lunalytics.xyz/api/status',
      interval: 30,
      retryInterval: 60,
      requestTimeout: 30,
      method: 'GET',
      headers: null,
      body: null,
      valid_status_codes: ['200-299'],
      email: 'ksjaay@lunalytics.xyz',
      type: 'http',
      port: null,
      uptimePercentage: 100,
      averageHeartbeatLatency: 820,
      lastCheck: 1715559831877,
      nextCheck: 1715646231877,
      cert: {
        isValid: true,
        issuer: { C: 'US', O: "Let's Encrypt", CN: 'R3' },
        validFrom: 'Apr 15 01:56:22 2024 GMT',
        validTill: 'Jul 14 01:56:21 2024 GMT',
        validOn: ['*.vercel.app', 'vercel.app'],
        daysRemaining: 62,
        lastCheck: 1715559831877,
        nextCheck: 1715646231877,
      },
      heartbeats: [],
    });
  });
});
