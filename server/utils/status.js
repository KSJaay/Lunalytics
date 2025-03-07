const layoutCheck = (layout) => {
  return (
    (layout.type === 'metrics' && layout.autoAdd) ||
    (layout.type === 'uptime' && layout.graphType !== 'Basic' && layout.autoAdd)
  );
};

export const hasAutoAdd = (content) => {
  if (Array.isArray(content)) {
    return content.some((statusPage) => {
      return statusPage.layout.some(layoutCheck);
    });
  }

  return content.layout.some(layoutCheck);
};

export const getMonitorIds = (content) => {
  const monitorIds = [];

  if (Array.isArray(content)) {
    for (const statusPage of content) {
      statusPage.layout.forEach((item) => {
        if (item.monitors) {
          item.monitors.forEach((value) => {
            monitorIds.push(value?.id || value);
          });
        }
      });
    }
  } else {
    content.layout.forEach((item) => {
      if (item.monitors) {
        item.monitors.forEach((value) => {
          monitorIds.push(value?.id || value);
        });
      }
    });
  }

  return monitorIds;
};
