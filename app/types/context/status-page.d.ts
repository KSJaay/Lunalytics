export interface StatusPageLayoutHeaderProps {
  id: string;
  type: 'header';
  title: {
    showLogo: boolean;
    showTitle: boolean;
    logoSize: string;
    titleSize: string;
    rotation: string;
    alignment: string;
    position: string;
  };
  status: {
    showTitle: boolean;
    showStatus: boolean;
    titleSize: string;
    statusSize: string;
    alignment: string;
    position: string;
  };
}

export interface StatusPageLayoutStatusProps {
  id: string;
  type: 'status';
  icon: boolean;
  design: string;
  size: string;
  titleSize: string;
  status: string;
}

export interface StatusPageLayoutIncidentProps {
  id: string;
  type: 'incidents';
  design: string;
  size: string;
  titleSize: string;
  status: string;
}

export interface StatusPageLayoutUptimeProps {
  id: string;
  type: 'uptime';
  title: string;
  monitors: string[];
  autoAdd: boolean;
  graphType: string;
  statusIndicator: string;
  status: string;
}

export interface StatusPageLayoutMetricsProps {
  id: string;
  type: 'metrics';
  title: string;
  autoAdd: boolean;
  graphType: string;
  data: {
    showName: boolean;
    showPing: boolean;
  };
  monitors: {
    id: string;
    title: string;
    graphType: string;
    showPing: boolean;
  };
}

export interface StatusPageLayoutHistoryProps {
  id: string;
  type: string;
}

export interface StatusPageLayoutCustomHTMLProps {
  id: string;
  type: string;
  content: string;
}

export interface StatusPageLayoutCustomCSSProps {
  id: string;
  type: string;
  content: string;
}

export interface ContextStatusPageSettingsProps {
  font: string;
  theme: string;
  headerBackground: string;
  background: string;
  textColor: string;
  highlight: string;
  url: string;
  logo: string;
  title: string;
  homepageUrl: string;
  isPublic: boolean;
  hidePaused: boolean;
}

export type ContextStatusPageLayoutProps =
  | StatusPageLayoutHeaderProps
  | StatusPageLayoutStatusProps
  | StatusPageLayoutIncidentProps
  | StatusPageLayoutUptimeProps
  | StatusPageLayoutMetricsProps
  | StatusPageLayoutHistoryProps
  | StatusPageLayoutCustomHTMLProps
  | StatusPageLayoutCustomCSSProps;

export interface ContextStatusPageProps {
  id: number;
  statusId: string;
  statusUrl: string;
  settings: ContextStatusPageSettingsProps;
  layout: ContextStatusPageLayoutProps[];
  email: string;
  createdAt: string;
}
