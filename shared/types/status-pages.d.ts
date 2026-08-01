interface StatusPageSettingsProps {
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

interface StatusPageProps extends StatusPageSettingsProps {
  layout: any[];
  lastUpdated: string;
}
