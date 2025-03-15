const statusSizes = ['XS', 'S', 'M', 'L', 'XL'];
const statusAlignments = ['Left', 'Center', 'Right'];
const statusRotations = ['Horizontal', 'Vertical'];
const statusThemes = ['Auto', 'Light', 'Dark'];
const statusDesign = ['Minimal', 'Simple', 'Pretty'];
const statusGraphTypes = ['Separate', 'Dropdown'];
const statusGraphDesigns = ['Basic', 'Pretty', 'Nerdy'];
const statusIndicators = ['Icon', 'Text'];
const statusBarDesign = ['Simple', 'Outline', 'Solid'];
const statusIncidents = ['Operational', 'Maintenance', 'Incident', 'Outage'];

const statusComponents = {
  header: {
    type: 'header',
    title: {
      showLogo: true,
      showTitle: true,
      logoSize: 'M',
      titleSize: 'M',
      rotation: 'Horizontal',
      alignment: 'Left',
      position: 'Left',
    },
    status: {
      showTitle: true,
      showStatus: true,
      titleSize: 'M',
      statusSize: 'XS',
      alignment: 'Right',
      position: 'Right',
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
    data: { showName: true, showPing: true },
    monitors: [],
  },
  history: { type: 'history' },
  customHTML: { type: 'customHTML', content: '' },
  customCSS: { type: 'customCSS', content: '' },
};

const defaultStatusValues = {
  font: 'Montserrat',
  theme: 'Auto',
  headerBackground: '#171a1c',
  background: '#171a1c',
  textColor: '#f3f6fb',
  highlight: '#17c964',
  url: '',
  logo: '/logo.svg',
  title: 'Lunalytics',
  homepageUrl: '',
  isPublic: false,
  hidePaused: false,
};

export {
  statusSizes,
  statusAlignments,
  statusRotations,
  statusThemes,
  statusDesign,
  statusGraphTypes,
  statusGraphDesigns,
  statusIndicators,
  statusBarDesign,
  statusIncidents,
  statusComponents,
  defaultStatusValues,
};
