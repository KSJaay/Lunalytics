import type {
  ContextStatusPageLayoutProps,
  ContextStatusPageProps,
  StatusPageLayoutMetricsProps,
  StatusPageLayoutUptimeProps,
} from '../../shared/types/context/status-page.d.js';

const layoutCheck = (
  layout: StatusPageLayoutMetricsProps | StatusPageLayoutUptimeProps
) => {
  return (
    (layout.type === 'metrics' && layout.autoAdd) ||
    (layout.type === 'uptime' && layout.autoAdd)
  );
};

export const hasAutoAdd = (content: any) => {
  if (Array.isArray(content)) {
    return content.some((statusPage) => {
      return statusPage.layout.some(layoutCheck);
    });
  }

  return content.layout.some(layoutCheck);
};

export const getMonitorIds = (
  content: ContextStatusPageProps | ContextStatusPageLayoutProps
) => {
  const monitorIds: string[] = [];

  if (Array.isArray(content)) {
    for (const statusPage of content) {
      statusPage.layout.forEach((item: any) => {
        if (item.monitors) {
          item.monitors.forEach((value: any) => {
            monitorIds.push(value?.id || value);
          });
        }
      });
    }
  } else {
    // @ts-ignore
    if (content.layout && Array.isArray(content.layout)) {
      // @ts-ignore
      content.layout.forEach((item: any) => {
        if (item.monitors) {
          item.monitors.forEach((value: any) => {
            monitorIds.push(value?.id || value);
          });
        }
      });
    }
  }

  return monitorIds;
};
