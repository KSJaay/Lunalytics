import database from '../connection.js';
import { ConflictError } from '../../../shared/utils/errors.js';
import { cleanStatusPage } from '../../class/status.js';
import { timeToMs } from '../../../shared/utils/ms.js';
import { cleanIncident } from '../../class/incident.js';
import randomId from '../../utils/randomId.js';

export const fetchAllStatusPages = async () => {
  const client = await database.connect();
  const statusPages = await client?.('status_page').select();

  return statusPages?.map((statusPage) => {
    return cleanStatusPage(statusPage);
  });
};

export const fetchWorkspaceStatusPages = async (workspaceId: string) => {
  const client = await database.connect();
  const statusPages = await client?.('status_page')
    .where({ workspaceId })
    .select();

  return statusPages?.map((statusPage) => {
    return cleanStatusPage(statusPage);
  });
};

export const fetchStatusPageUsingId = async (
  statusId: string,
  workspaceId: string
) => {
  const client = await database.connect();
  return client?.('status_page').where({ statusId, workspaceId }).first();
};

export const fetchStatusPageUsingUrl = async (url: string) => {
  const client = await database.connect();
  return client?.('status_page').where({ statusUrl: url }).first();
};

export const fetchStatusPageUsingDomain = async (domain: string) => {
  const client = await database.connect();

  const statusPage = await client?.('status_page')
    .whereRaw(
      "EXISTS (SELECT 1 FROM json_each(settings, '$.customDomains') WHERE value = ?)",
      [domain]
    )
    .first();

  return statusPage;
};

export const createStatusPage = async (
  workspaceId: string,
  settings: any,
  layout: any,
  user: any
) => {
  const statusExists = await fetchStatusPageUsingUrl(settings.url);

  if (statusExists) {
    throw new ConflictError('Status page already exists with this URL.');
  }

  const filteredComponents = layout.filter((item: any) => {
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
  const client = await database.connect();

  await client?.('status_page').insert({
    statusId: uniqueId,
    workspaceId,
    statusUrl: settings.url,
    settings: JSON.stringify(settings),
    layout: JSON.stringify(filteredComponents),
    email: user.email,
    created_at: new Date().toISOString(),
  });

  return client?.('status_page')
    .where({ statusId: uniqueId, workspaceId })
    .first();
};

export const updateStatusPage = async (
  workspaceId: string,
  statusId: string,
  settings: any,
  layout: any,
  user: any
) => {
  const statusExists = await fetchStatusPageUsingId(statusId, workspaceId);

  if (!statusExists) {
    throw new ConflictError('Status page does not exist.');
  }

  const filteredComponents = layout.filter((item: any) => {
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

  const client = await database.connect();

  await client?.('status_page')
    .where({ statusId, workspaceId })
    .update({
      statusUrl: settings.url,
      settings: JSON.stringify(settings),
      layout: JSON.stringify(filteredComponents),
      email: user.email,
    });

  return client?.('status_page').where({ statusId, workspaceId }).first();
};

export const deleteStatusPage = async (
  statusId: string,
  workspaceId: string
) => {
  const statusExists = await fetchStatusPageUsingId(statusId, workspaceId);

  if (!statusExists) {
    throw new ConflictError('Status page does not exist.');
  }

  const client = await database.connect();

  await client?.('status_page').where({ statusId, workspaceId }).delete();
};

export const fetchMonitorsUsingIdArray = async (
  monitorIds: string[],
  workspaceId: string
) => {
  const client = await database.connect();

  return client?.('monitor')
    .whereIn('monitorId', monitorIds)
    .andWhere({ workspaceId })
    .select();
};

export const fetchAllMonitors = async (workspaceId?: string) => {
  const client = await database.connect();

  return client?.('monitor').where({ workspaceId }).select();
};

export const fetchIncidentsUsingIdArray = async (
  monitorIds: string[],
  workspaceId: string,
  days = 90
) => {
  const ninetyDaysAgo = new Date(
    Date.now() - timeToMs(days, 'days')
  ).toISOString();

  const client = await database.connect();

  const query = await client?.('incident')
    .whereRaw(
      `EXISTS (
        SELECT 1 FROM json_each(monitorIds)
        WHERE json_each.value IN (${monitorIds.map(() => '?').join(',')})
      )`,
      monitorIds
    )
    .andWhere('created_at', '>', ninetyDaysAgo)
    .andWhere({ workspaceId })
    .select();

  return query?.map((incident: any) => cleanIncident(incident));
};
