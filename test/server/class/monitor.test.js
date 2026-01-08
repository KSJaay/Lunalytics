import { expect, it } from 'vitest';
import { cleanMonitor } from '../../../server/class/monitor/index';

describe('Monitor - Class', () => {
  const monitor = {
    monitorId: '4d048471-9e85-428b-8050-4238f6033478',
    parentId: '4d048471-9e85-428b-8050-4238f6033479',
    name: 'Lunalytics',
    url: 'https://demo.lunalytics.xyz/api/status',
    created_at: '2025-08-23T17:00:00.000Z',
    interval: '30',
    retryInterval: '60',
    requestTimeout: '30',
    method: 'GET',
    headers: null,
    body: null,
    valid_status_codes: JSON.stringify(['200-299']),
    email: 'ksjaay@lunalytics.xyz',
    notificationId: 'test',
    notificationType: 'All',
    type: 'http',
    port: null,
    uptimePercentage: 100,
    averageHeartbeatLatency: 820,
    ignoreTls: true,
    json_query: JSON.stringify([
      { key: 'test', operator: '==', value: 'test' },
    ]),
    showFilters: false,
    paused: false,
    icon: {
      id: 'lunalytics',
      url: 'https://demo.lunalytics.xyz/logo.svg',
      name: 'Lunalytics',
    },
    retry: 1,
  };

  const certificate = {
    isValid: true,
    issuer: JSON.stringify({ C: 'US', O: "Let's Encrypt", CN: 'R3' }),
    validFrom: 'Apr 15 01:56:22 2024 GMT',
    validTill: 'Jul 14 01:56:21 2024 GMT',
    validOn: JSON.stringify(['*.vercel.app', 'vercel.app']),
    daysRemaining: 62,
    nextCheck: 1715646231877,
  };

  it('should return valid monitor using cleanPartialMonitor', () => {
    expect(cleanMonitor(monitor, false, false)).toEqual({
      monitorId: '4d048471-9e85-428b-8050-4238f6033478',
      parentId: '4d048471-9e85-428b-8050-4238f6033479',
      name: 'Lunalytics',
      url: 'https://demo.lunalytics.xyz/api/status',
      created_at: '2025-08-23T17:00:00.000Z',
      interval: 30,
      retryInterval: 60,
      requestTimeout: 30,
      method: 'GET',
      headers: {},
      body: {},
      valid_status_codes: ['200-299'],
      email: 'ksjaay@lunalytics.xyz',
      notificationId: 'test',
      notificationType: 'All',
      type: 'http',
      uptimePercentage: 100,
      averageHeartbeatLatency: 820,
      ignoreTls: true,
      showFilters: false,
      paused: false,
      heartbeats: undefined,
      cert: undefined,
      retry: 1,
      icon: {
        id: 'lunalytics',
        name: 'Lunalytics',
        url: 'https://demo.lunalytics.xyz/logo.svg',
      },
    });
  });

  it('should return valid monitor using cleanMonitor', () => {
    expect(
      cleanMonitor({
        ...monitor,
        cert: certificate,
        heartbeats: [],
      })
    ).toEqual({
      monitorId: '4d048471-9e85-428b-8050-4238f6033478',
      parentId: '4d048471-9e85-428b-8050-4238f6033479',
      name: 'Lunalytics',
      url: 'https://demo.lunalytics.xyz/api/status',
      created_at: '2025-08-23T17:00:00.000Z',
      interval: 30,
      retryInterval: 60,
      requestTimeout: 30,
      method: 'GET',
      headers: {},
      body: {},
      valid_status_codes: ['200-299'],
      email: 'ksjaay@lunalytics.xyz',
      notificationId: 'test',
      notificationType: 'All',
      type: 'http',
      uptimePercentage: 100,
      averageHeartbeatLatency: 820,
      showFilters: false,
      ignoreTls: true,
      paused: false,
      cert: {
        isValid: true,
        issuer: { C: 'US', O: "Let's Encrypt", CN: 'R3' },
        validFrom: 'Apr 15 01:56:22 2024 GMT',
        validTill: 'Jul 14 01:56:21 2024 GMT',
        validOn: ['*.vercel.app', 'vercel.app'],
        daysRemaining: 62,
        nextCheck: 1715646231877,
      },
      heartbeats: [],
      retry: 1,
      icon: {
        id: 'lunalytics',
        name: 'Lunalytics',
        url: 'https://demo.lunalytics.xyz/logo.svg',
      },
    });
  });
});
