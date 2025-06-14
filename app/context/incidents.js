import { action, computed, makeObservable, observable } from 'mobx';

class IncidentStore {
  constructor() {
    this.incidents = observable.map();

    makeObservable(this, {
      incidents: observable,
      setIncidents: action,
      addIncident: action,
      deleteIncident: action,
      getIncidentById: action,
      allIncidents: computed,
    });
  }

  setIncidents = (incidents) => {
    for (const incident of incidents) {
      this.incidents.set(incident.incidentId, incident);
    }
  };

  addIncident = (incident) => {
    this.incidents.set(incident.incidentId, incident);
  };

  deleteIncident = (id) => {
    this.incidents.delete(id);
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
}

export default IncidentStore;
