export const defaultHeartbeats = Array.from({ length: 100 })
  .map((_, i) => ({
    time: Date.now() - i * 10000,
    latency: Math.floor(Math.random() * 100),
  }))
  .reverse();

export const defaultIncidents = [
  {
    title: 'Scheduled Maintenance',
    description: "I've set my server on fire. Going to take 2 hours to fix it.",
    timestamp: Date.now(),
    type: 'Maintenance',
  },
  {
    title: 'Partially Degraded Service',
    description: 'Something is broken, but not sure where 🤷🏽',
    timestamp: Date.now(),
    type: 'Incident',
  },
  {
    title: 'Degraded Performance',
    description: "IT'S ALL GONE!! We're working on fixing it.",
    timestamp: Date.now(),
    type: 'Outage',
  },
];

export const statusComponents = {
  header: {
    type: 'header',
    visible: true,
    title: {
      showLogo: true,
      showTitle: true,
      logoSize: 'M',
      titleSize: 'M',
      rotation: 'Horizontal',
      alignment: 'Left',
      position: 'left',
    },
    status: {
      showTitle: true,
      showStatus: true,
      titleSize: 'M',
      statusSize: 'XS',
      alignment: 'Right',
      position: 'right',
    },
  },
  status: {
    type: 'status',
    icon: true,
    design: 'Simple',
    size: 'M',
    titleSize: 'M',
    status: 'Operational',
  },
  incidents: {
    type: 'incidents',
    design: 'Simple',
    size: 'M',
    titleSize: 'M',
    status: 'Operational',
  },
  uptime: {
    type: 'uptime',
    title: '',
    monitors: [],
    autoAdd: false,
    graphType: 'Basic',
    statusIndicator: 'Text',
    status: 'Operational',
  },
  metrics: {
    type: 'metrics',
    title: '',
    autoAdd: false,
    graphType: 'Separate',
    data: {
      showName: true,
      showPing: true,
    },
    monitors: [],
  },

  history: { type: 'history', incidents: [] },
  customHTML: { type: 'customHTML', content: '' },
  customCSS: { type: 'customCSS', content: '' },
};

export const defaultStatusValues = {
  font: 'Montserrat',
  theme: 'Auto',
  headerBackground: '#171a1c',
  background: '#171a1c',
  textColor: '#f3f6fb',
  highlight: '#17c964',
  url: '',
  logo: '/logo.svg',
  title: 'Lunalytics',
  homepage: '',
  isPublic: false,
  hidePaused: false,
};

export const defaultStatusComponents = [
  { id: 'default-1', isMinimized: false, ...statusComponents.header },
  { id: 'default-2', isMinimized: false, ...statusComponents.status },
  { id: 'default-3', isMinimized: false, ...statusComponents.uptime },
  { id: 'default-4', isMinimized: false, ...statusComponents.metrics },
  { id: 'default-5', isMinimized: false, ...statusComponents.history },
];
