import { makeAutoObservable, observable } from 'mobx';
import Incident from './incident';
import type { ContextIncidentProps } from '../../types/context/incident';

class IncidentStore {
  incidents: Map<string, Incident>;
  activeIncident: Incident | null | undefined;

  constructor() {
    this.incidents = observable.map();
    this.activeIncident = null;

    makeAutoObservable(this);
  }

  setIncidents = (incidents: ContextIncidentProps[]) => {
    for (const incident of incidents) {
      this.incidents.set(incident.incidentId, new Incident(incident));
    }
  };

  addIncident = (incident: ContextIncidentProps) => {
    this.incidents.set(incident.incidentId, new Incident(incident));

    if (incident.incidentId === this.activeIncident?.incidentId) {
      this.setActiveIncident(incident.incidentId);
    }
  };

  deleteIncident = (id: string) => {
    this.incidents.delete(id);

    if (id === this.activeIncident?.incidentId) {
      this.setActiveIncident();
    }
  };

  getIncidentById = (id: string) => {
    return this.incidents.get(id);
  };

  get allIncidents() {
    return (
      Array.from(this.incidents.values()).sort((a, b) =>
        a.createdAt > b.createdAt ? -1 : 1
      ) || []
    );
  }

  setActiveIncident = (id?: string) => {
    if (id === 'mobile-reset') {
      this.activeIncident = null;
      return;
    }

    if (!id || !this.incidents.has(id)) {
      this.activeIncident = this.incidents.values().next().value || null;
      return;
    }

    this.activeIncident = this.incidents.get(id);
  };
}

export default IncidentStore;
