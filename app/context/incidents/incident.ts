import { makeAutoObservable } from 'mobx';
import type {
  ContextIncidentMessageProps,
  ContextIncidentProps,
} from '../../../shared/types/context/incident';

class Incident {
  title: string;
  incidentId: string;
  affect: 'Outage' | 'Incident' | 'Maintenance' | 'Operational';
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
  messages: Array<ContextIncidentMessageProps>;
  monitorIds: string[];
  created_at: string;
  completedAt: string | null;
  isClosed: boolean;

  constructor({
    title,
    incidentId,
    affect,
    status,
    messages,
    monitorIds,
    created_at,
    completedAt,
    isClosed,
  }: ContextIncidentProps) {
    this.title = title;
    this.incidentId = incidentId;
    this.affect = affect;
    this.status = status;
    this.messages = messages;
    this.monitorIds = monitorIds;
    this.created_at = created_at;
    this.completedAt = completedAt;
    this.isClosed = isClosed;

    makeAutoObservable(this);
  }
}

export default Incident;
