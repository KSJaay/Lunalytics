export interface ContextMonitorProps {
  monitorId: string;
  name: string;
  url: string;
  retry: number;
  interval: number;
  retryInterval: number;
  requestTimeout: number;
  method: string;
  headers: Record<string, string>;
  body: Record<string, any>;
  valid_status_codes: string[];
  email: string;
  type: 'docker' | 'http' | 'json' | 'ping' | 'push' | 'tcp';
  notificationId: string;
  notificationType: string;
  uptimePercentage: number;
  averageHeartbeatLatency: number;
  showFilters: boolean;
  paused: boolean;
  ignoreTls: boolean;
  created_at: string;
  cert: Certificate;
  heartbeats: Heartbeat[];
  icon: { id: string; name: string; url: string };
}

export interface Certificate {
  isValid: boolean;
  issuer: Issuer;
  validFrom: string;
  validTill: string;
  validOn: any[];
  daysRemaining: number;
  nextCheck: string;
}

export interface Issuer {
  C: string;
  O: string;
  CN: string;
}

export interface Heartbeat {
  id: number;
  status: number;
  latency: number;
  date: string;
  isDown: boolean;
  message: string;
}
