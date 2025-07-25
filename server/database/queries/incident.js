import { cleanIncident } from '../../class/incident.js';
import randomId from '../../utils/randomId.js';
import SQLite from '../sqlite/setup.js';

const getUniqueId = async () => {
  let id = randomId();

  let exists = await SQLite.client('incident').where({ id }).first();

  while (exists) {
    id = randomId();
    exists = await SQLite.client('incident').where({ id }).first();
  }

  return id;
};

const fetchIncident = async (incidentId) => {
  const incident = await SQLite.client('incident')
    .where({ incidentId })
    .first();

  return cleanIncident(incident);
};

const fetchAllIncidents = async () => {
  const incidents = await SQLite.client('incident')
    .where({ isClosed: false })
    .select();

  return incidents.map((incident) => cleanIncident(incident));
};

const createIncident = async (data) => {
  const incidentId = await getUniqueId();
  await SQLite.client('incident').insert({
    ...data,
    incidentId,
    messages: JSON.stringify(data.messages),
    monitorIds: JSON.stringify(data.monitorIds),
  });

  return cleanIncident({ ...data, incidentId });
};

const updateIncident = async (incidentId, data) => {
  const query = await SQLite.client('incident')
    .where({ incidentId })
    .update({
      ...data,
      messages: JSON.stringify(data.messages),
      monitorIds: JSON.stringify(data.monitorIds),
    })
    .returning('*');

  return cleanIncident(query[0]);
};

const deleteIncident = async (incidentId) => {
  await SQLite.client('incident').where({ incidentId }).del();

  return true;
};

export {
  fetchIncident,
  fetchAllIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
};
