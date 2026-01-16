interface IncidentMessageProps {
  created_at: string;
  email: string;
  endedAt: string;
  message: string;
  monitorIds: string[];
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
}

export interface IncidentProps {
  title: string;
  incidentId: string;
  affect: 'Outage' | 'Incident' | 'Maintenance' | 'Operational';
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
  messages: ContextIncidentMessageProps[];
  monitorIds: string[];
  created_at: string;
  completedAt: string | null;
  isClosed: boolean;
}
