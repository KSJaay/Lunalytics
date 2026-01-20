import { cleanIncident } from '../../class/incident.js';
import randomId from '../../utils/randomId.js';
import database from '../connection.js';

const fetchIncident = async (incidentId: string, workspaceId: string) => {
  const client = await database.connect();
  const incident = await client?.('incident')
    .where({ incidentId, workspaceId })
    .first();

  return cleanIncident(incident);
};

const fetchAllIncidents = async (workspaceId: string) => {
  const client = await database.connect();
  const incidents = await client?.('incident')
    .where({ workspaceId, isClosed: false })
    .select();

  return incidents?.map((incident) => cleanIncident(incident));
};

const createIncident = async (data: any, workspaceId: string) => {
  const client = await database.connect();
  const incidentId = randomId();

  await client?.('incident').insert({
    ...data,
    incidentId,
    workspaceId,
    messages: JSON.stringify(data.messages),
    monitorIds: JSON.stringify(data.monitorIds),
  });

  return cleanIncident({ ...data, incidentId, workspaceId });
};

const updateIncident = async (
  incidentId: string,
  workspaceId: string,
  data: any
) => {
  const client = await database.connect();

  const query = await client?.('incident')
    .where({ incidentId, workspaceId })
    .update({
      ...data,
      messages: JSON.stringify(data.messages),
      monitorIds: JSON.stringify(data.monitorIds),
    })
    .returning('*');

  if (!query || query.length === 0) {
    return null;
  }

  return cleanIncident(query[0]);
};

const deleteIncident = async (incidentId: string, workspaceId: string) => {
  const client = await database.connect();
  await client?.('incident').where({ incidentId, workspaceId }).del();

  return true;
};

export {
  fetchIncident,
  fetchAllIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
};
