interface ContextIncidentMessageProps {
  createdAt: string;
  email: string;
  endedAt: string;
  message: string;
  monitorIds: string[];
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
}

export interface ContextIncidentProps {
  title: string;
  incidentId: string;
  affect: 'Outage' | 'Incident' | 'Maintenance' | 'Operational';
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
  messages: ContextIncidentMessageProps[];
  monitorIds: string[];
  createdAt: string;
  completedAt: string | null;
  isClosed: boolean;
}
