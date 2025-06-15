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
    affect,
    status,
    messages,
    monitorIds,
    createdAt,
    completedAt,
    isClosed,
  } = incident;

  return {
    incidentId,
    title,
    monitorIds: cleanJson(monitorIds),
    messages: cleanJson(messages),
    affect,
    status,
    createdAt,
    completedAt,
    isClosed,
  };
};
