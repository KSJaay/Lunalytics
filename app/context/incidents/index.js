import { makeAutoObservable, observable } from 'mobx';
import Incident from './incident';

class IncidentStore {
  constructor() {
    this.incidents = observable.map();

    makeAutoObservable(this);
  }

  setIncidents = (incidents) => {
    for (const incident of incidents) {
      this.incidents.set(incident.incidentId, new Incident(incident));
    }
  };

  addIncident = (incident) => {
    this.incidents.set(incident.incidentId, new Incident(incident));
  };

  deleteIncident = (id) => {
    this.incidents.delete(id);
  };

  getIncidentById = (id) => {
    return this.incidents.get(id);
  };

  updateMessages = (incidentId, messages) => {
    const incident = this.getIncidentById(incidentId);

    if (incident) {
      incident.updateMessages(messages);
    }
  };

  get allIncidents() {
    return (
      Array.from(this.incidents.values()).sort((a, b) =>
        a.createdAt > b.createdAt ? -1 : 1
      ) || []
    );
  }
}

export default IncidentStore;
