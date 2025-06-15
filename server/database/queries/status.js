import SQLite from '../sqlite/setup.js';
import { ConflictError } from '../../../shared/utils/errors.js';
import { cleanStatusPage } from '../../class/status.js';
import { timeToMs } from '../../../shared/utils/ms.js';
import { cleanIncident } from '../../class/incident.js';
import randomId from '../../utils/randomId.js';

export const fetchAllStatusPages = async () => {
  const statusPages = await SQLite.client('status_page').select();

  return statusPages.map((statusPage) => {
    return cleanStatusPage(statusPage);
  });
};

export const fetchStatusPageUsingId = async (statusId) => {
  return SQLite.client('status_page').where({ statusId }).first();
};

export const fetchStatusPageUsingUrl = async (url) => {
  return SQLite.client('status_page').where({ statusUrl: url }).first();
};

export const createStatusPage = async (settings, layout, user) => {
  const statusExists = await fetchStatusPageUsingUrl(settings.url);

  if (statusExists) {
    throw new ConflictError('Status page already exists with this URL.');
  }

  const filteredComponents = layout.filter((item) => {
    if (item.type === 'uptime' || item.type === 'metrics') {
      return item.monitors.length > 0 || item.autoAdd;
    }

    if (item.type === 'header') {
      return (
        item.title.showLogo ||
        item.title.showTitle ||
        item.status.showTitle ||
        item.status.showStatus
      );
    }

    if (item.type === 'customHTML' || item.type === 'customCSS') {
      return item.content.length > 0;
    }

    return true;
  });

  const uniqueId = randomId();

  await SQLite.client('status_page').insert({
    statusId: uniqueId,
    statusUrl: settings.url,
    settings: JSON.stringify(settings),
    layout: JSON.stringify(filteredComponents),
    email: user.email,
    createdAt: new Date().toISOString(),
  });

  return SQLite.client('status_page').where({ statusId: uniqueId }).first();
};

export const updateStatusPage = async (statusId, settings, layout, user) => {
  const statusExists = await fetchStatusPageUsingId(statusId);

  if (!statusExists) {
    throw new ConflictError('Status page does not exist.');
  }

  const filteredComponents = layout.filter((item) => {
    if (item.type === 'uptime' || item.type === 'metrics') {
      return item.monitors?.length > 0 || item.autoAdd;
    }

    if (item.type === 'header') {
      return (
        item.title.showLogo ||
        item.title.showTitle ||
        item.status.showTitle ||
        item.status.showStatus
      );
    }

    if (item.type === 'customHTML' || item.type === 'customCSS') {
      return item.content?.length > 0;
    }

    return true;
  });

  await SQLite.client('status_page')
    .where({ statusId })
    .update({
      statusUrl: settings.url,
      settings: JSON.stringify(settings),
      layout: JSON.stringify(filteredComponents),
      email: user.email,
    });

  return SQLite.client('status_page').where({ statusId }).first();
};

export const deleteStatusPage = async (statusId) => {
  const statusExists = await fetchStatusPageUsingId(statusId);

  if (!statusExists) {
    throw new ConflictError('Status page does not exist.');
  }

  await SQLite.client('status_page').where({ statusId }).delete();
};

export const fetchMonitorsUsingIdArray = async (monitorIds) => {
  return SQLite.client('monitor').whereIn('monitorId', monitorIds).select();
};

export const fetchAllMonitors = async () => {
  return SQLite.client('monitor');
};

export const fetchIncidentsUsingIdArray = async (monitorIds, days = 90) => {
  const nintyDaysAgo = new Date(
    Date.now() - timeToMs(days, 'days')
  ).toISOString();

  const query = await SQLite.client('incident')
    .whereRaw(
      `EXISTS (
        SELECT 1 FROM json_each(monitorIds)
        WHERE json_each.value IN (${monitorIds.map(() => '?').join(',')})
      )`,
      monitorIds
    )
    .andWhere('createdAt', '>', nintyDaysAgo)
    .select();

  return query.map((incident) => cleanIncident(incident));
};
