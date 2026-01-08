export type MonitorType = 'docker' | 'http' | 'json' | 'ping' | 'push' | 'tcp';

export interface MonitorProps {
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
  type: MonitorType;
  notificationId: string;
  notificationType: string;
  uptimePercentage: number;
  averageHeartbeatLatency: number;
  showFilters: boolean;
  paused: boolean;
  ignoreTls: boolean;
  created_at: string;
  cert: CertificateProps;
  heartbeats: HeartbeatProps[];
  statusChanged: HeartbeatProps[];
  icon: { id: string; name: string; url: string };
  [key: string]: any;
}

export interface CertificateProps {
  isValid: boolean;
  issuer: IssuerProps;
  validFrom: string;
  validTill: string;
  validOn: any[];
  daysRemaining: number;
  nextCheck: string;
}

export interface IssuerProps {
  C: string;
  O: string;
  CN: string;
}

export interface HeartbeatProps {
  id: number;
  status: number;
  latency: number;
  date: string;
  isDown: boolean;
  message: string;
}
