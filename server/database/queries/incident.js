import { cleanIncident } from '../../class/incident.js';
import randomId from '../../utils/randomId.js';
import database from '../connection.js';

const fetchIncident = async (incidentId, workspaceId) => {
  const client = await database.connect();
  const incident = await client('incident')
    .where({ incidentId, workspaceId })
    .first();

  return cleanIncident(incident);
};

const fetchAllIncidents = async (workspaceId) => {
  const client = await database.connect();
  const incidents = await client('incident')
    .where({ workspaceId, isClosed: false })
    .select();

  return incidents.map((incident) => cleanIncident(incident));
};

const createIncident = async (data, workspaceId) => {
  const client = await database.connect();
  const incidentId = randomId();

  await client('incident').insert({
    ...data,
    incidentId,
    workspaceId,
    messages: JSON.stringify(data.messages),
    monitorIds: JSON.stringify(data.monitorIds),
  });

  return cleanIncident({ ...data, incidentId, workspaceId });
};

const updateIncident = async (incidentId, workspaceId, data) => {
  const client = await database.connect();

  const query = await client('incident')
    .where({ incidentId, workspaceId })
    .update({
      ...data,
      messages: JSON.stringify(data.messages),
      monitorIds: JSON.stringify(data.monitorIds),
    })
    .returning('*');

  return cleanIncident(query[0]);
};

const deleteIncident = async (incidentId, workspaceId) => {
  const client = await database.connect();
  await client('incident').where({ incidentId, workspaceId }).del();

  return true;
};

export {
  fetchIncident,
  fetchAllIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
};
