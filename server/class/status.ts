import { defaultStatusValues } from '../../shared/constants/status.js';

const parseJson = (obj, isArray = false) => {
  try {
    return JSON.parse(obj);
  } catch {
    return isArray ? [] : {};
  }
};

export const cleanStatusPage = (status) => ({
  id: status.id,
  workspaceId: status.workspaceId,
  statusId: status.statusId,
  statusUrl: status.statusUrl,
  settings: { ...defaultStatusValues, ...parseJson(status.settings) },
  layout: parseJson(status.layout, true),
  email: status.email,
  created_at: status.created_at,
  lastUpdated: status.lastUpdated,
});

export const cleanStatusPageWithMonitors = (status) => ({
  settings: { ...defaultStatusValues, ...parseJson(status.settings) },
  layout: parseJson(status.layout, true),
});

export const cleanStatusApiResponse = (data) => ({
  id: data.id,
  workspaceId: data.workspaceId,
  statusId: data.statusId,
  statusUrl: data.statusUrl,
  settings: data.settings,
  layout: data.layout,
  monitors: data.monitors,
  incidents: data.incidents,
  heartbeats: data.heartbeats,
  lastUpdated: data.lastUpdated,
});
