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
  isMinimized?: boolean;
}

export interface StatusPageLayoutStatusProps {
  id: string;
  type: 'status';
  icon: boolean;
  design: string;
  size: string;
  titleSize: string;
  status: string;
  isMinimized?: boolean;
}

export interface StatusPageLayoutIncidentProps {
  id: string;
  type: 'incidents';
  design: string;
  size: string;
  titleSize: string;
  status: string;
  isMinimized?: boolean;
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
  isMinimized?: boolean;
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
  isMinimized?: boolean;
}

export interface StatusPageLayoutHistoryProps {
  id: string;
  type: string;
  isMinimized?: boolean;
}

export interface StatusPageLayoutCustomHTMLProps {
  id: string;
  type: string;
  content: string;
  isMinimized?: boolean;
}

export interface StatusPageLayoutCustomCSSProps {
  id: string;
  type: string;
  content: string;
  isMinimized?: boolean;
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
  customDomains?: string[];
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
  created_at: string;
}
