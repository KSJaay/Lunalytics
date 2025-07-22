import { makeAutoObservable, observable } from 'mobx';
import Incident from './incident';

class IncidentStore {
  constructor() {
    this.incidents = observable.map();
    this.activeIncident = null;

    makeAutoObservable(this);
  }

  setIncidents = (incidents) => {
    for (const incident of incidents) {
      this.incidents.set(incident.incidentId, new Incident(incident));
    }
  };

  addIncident = (incident) => {
    this.incidents.set(incident.incidentId, new Incident(incident));

    if (incident.incidentId === this.activeIncident?.incidentId) {
      this.setActiveIncident(incident.incidentId);
    }
  };

  deleteIncident = (id) => {
    this.incidents.delete(id);

    if (id === this.activeIncident?.incidentId) {
      this.setActiveIncident();
    }
  };

  getIncidentById = (id) => {
    return this.incidents.get(id);
  };

  get allIncidents() {
    return (
      Array.from(this.incidents.values()).sort((a, b) =>
        a.createdAt > b.createdAt ? -1 : 1
      ) || []
    );
  }

  setActiveIncident = (id) => {
    if (!id || !this.incidents.has(id)) {
      this.activeIncident = this.incidents.values().next().value || null;
      return;
    }

    this.activeIncident = this.incidents.get(id);
  };
}

export default IncidentStore;
