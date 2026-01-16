import logger from '../utils/logger.js';

const cleanJson = (json) => {
  try {
    if (typeof json !== 'string') return json;

    return JSON.parse(json);
  } catch (error) {
    logger.error('Error converting json', {
      message: error.message,
      stack: error.stack,
    });

    return json;
  }
};

export const cleanIncident = (incident) => {
  const {
    title,
    incidentId,
    workspaceId,
    affect,
    status,
    messages,
    monitorIds,
    created_at,
    completedAt,
    isClosed,
  } = incident;

  return {
    incidentId,
    workspaceId,
    title,
    monitorIds: cleanJson(monitorIds),
    messages: cleanJson(messages),
    affect,
    status,
    created_at,
    completedAt,
    isClosed: isClosed == '1',
  };
};
