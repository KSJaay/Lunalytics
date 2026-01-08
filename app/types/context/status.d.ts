import type {
  ContextStatusPageLayoutProps,
  ContextStatusPageSettingsProps,
} from './status-page';

export interface ContextStatusIncidentMessageProps {
  message: string;
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
  email: string;
  created_at: string;
  endedAt: string | null;
  monitorIds: string[];
}

export interface ContextStatusIncidentProps {
  incidentId: string;
  title: string;
  monitorIds: string[];
  messages: ContextStatusIncidentMessageProps[];
  affect: 'Outage' | 'Incident' | 'Maintenance' | 'Operational';
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
  created_at: string;
  completedAt: string | null;
  isClosed: boolean;
}

export interface ContextStatusMonitorProps {
  monitorId: string;
  name: string;
  url: string;
  created_at: string;
  paused: boolean;
}

export interface ContextStatusHeartbeatProps {
  date: string;
  status: number;
  latency: number;
}

export interface ContextStatusProps {
  id: number;
  statusId: string;
  statusUrl: string;
  settings: ContextStatusPageSettingsProps;
  layout: ContextStatusPageLayoutProps[];
  monitors: Record<string, ContextStatusMonitorProps>;
  incidents: ContextStatusIncidentProps[];
  heartbeats: Record<string, ContextStatusHeartbeatProps[]>;
}
