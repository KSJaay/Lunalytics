import { makeAutoObservable } from 'mobx';

class Incident {
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
  } = {}) {
    this.title = title;
    this.incidentId = incidentId;
    this.affect = affect;
    this.status = status;
    this.messages = messages; // Array
    this.monitorIds = monitorIds; // Array
    this.createdAt = createdAt;
    this.completedAt = completedAt;
    this.isClosed = isClosed;

    makeAutoObservable(this);
  }
}

export default Incident;
