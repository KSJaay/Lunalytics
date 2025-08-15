import { makeAutoObservable } from 'mobx';
import type {
  ContextIncidentMessageProps,
  ContextIncidentProps,
} from '../../types/context/incident';

class Incident {
  title: string;
  incidentId: string;
  affect: 'Outage' | 'Incident' | 'Maintenance' | 'Operational';
  status: 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';
  messages: Array<ContextIncidentMessageProps>;
  monitorIds: string[];
  createdAt: string;
  completedAt: string | null;
  isClosed: boolean;

  constructor({
    title,
    incidentId,
    affect,
    status,
    messages,
    monitorIds,
    createdAt,
    completedAt,
    isClosed,
  }: ContextIncidentProps) {
    this.title = title;
    this.incidentId = incidentId;
    this.affect = affect;
    this.status = status;
    this.messages = messages;
    this.monitorIds = monitorIds;
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.isClosed = isClosed;

    makeAutoObservable(this);
  }
}

export default Incident;
