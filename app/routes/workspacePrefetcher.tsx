import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Loading from '../components/ui/loading';
import { fetchMonitorById } from '../services/monitor/fetch';
import { createGetRequest } from '../services/axios';
import useNotificationContext from '../context/notifications';
import useGlobalContext from '../context/global';
import useIncidentContext from '../context/incidents';
import useStatusContext from '../context/status';

type Stores = {
  notificationStore: ReturnType<typeof useNotificationContext>;
  globalStore: ReturnType<typeof useGlobalContext>;
  incidentStore: ReturnType<typeof useIncidentContext>;
  statusStore: ReturnType<typeof useStatusContext>;
};

type PageConfig = {
  path: string;
  url: string;
  hasLoaded: (s: Stores) => boolean;
  setData: (s: Stores, data: any) => void;
};

const pageConfigs: PageConfig[] = [
  {
    path: '/incidents',
    url: '/api/workspace/incidents',
    hasLoaded: (s) => s.incidentStore.hasLoadedIncidents,
    setData: (s, data) => s.incidentStore.setIncidents(data),
  },
  {
    path: '/home',
    url: '/api/workspace/monitors',
    hasLoaded: (s) => s.globalStore.hasLoadedMonitors,
    setData: (s, data) => {
      s.globalStore.setMonitors(data);
      s.globalStore.setTimeouts(data, fetchMonitorById);
    },
  },
  {
    path: '/notifications',
    url: '/api/workspace/notifications',
    hasLoaded: (s) => s.notificationStore.hasLoadedNotifications,
    setData: (s, data) => s.notificationStore.setNotifications(data),
  },
  {
    path: '/status-pages',
    url: '/api/workspace/status-pages',
    hasLoaded: (s) => s.statusStore.hasLoadedStatusPages,
    setData: (s, data) => s.statusStore.setStatusPages(data),
  },
];

const getPageConfig = (pathname: string): PageConfig =>
  pageConfigs.find((cfg) => pathname.startsWith(cfg.path)) ?? pageConfigs[0];

const WorkspacePrefetcher = observer(
  ({ children }: { children: React.ReactNode }) => {
    const location = useLocation();
    const stores: Stores = {
      notificationStore: useNotificationContext(),
      globalStore: useGlobalContext(),
      incidentStore: useIncidentContext(),
      statusStore: useStatusContext(),
    };

    const storesRef = useRef(stores);
    storesRef.current = stores;

    const inFlight = useRef(new Map<string, Promise<void>>());
    const [, forceRender] = useState(0);

    const ensureFetched = (cfg: PageConfig): Promise<void> => {
      if (cfg.hasLoaded(storesRef.current)) return Promise.resolve();
      const existing = inFlight.current.get(cfg.url);
      if (existing) return existing;

      const promise = createGetRequest(cfg.url)
        .then((res) => {
          cfg.setData(storesRef.current, res?.data);
        })
        .catch(() => {})
        .finally(() => {
          inFlight.current.delete(cfg.url);
        });

      inFlight.current.set(cfg.url, promise);
      return promise;
    };

    const currentConfig = getPageConfig(location.pathname);
    const currentLoaded = currentConfig.hasLoaded(stores);

    useEffect(() => {
      pageConfigs.forEach((cfg) => {
        ensureFetched(cfg);
      });
    }, []);

    useEffect(() => {
      if (currentLoaded) return;
      let cancelled = false;
      ensureFetched(currentConfig).then(() => {
        if (!cancelled) forceRender((n) => n + 1);
      });
      return () => {
        cancelled = true;
      };
    }, [currentConfig, currentLoaded]);

    if (!currentLoaded) {
      return <Loading asContainer activeUrl={currentConfig.path} />;
    }

    return children;
  }
);

export default WorkspacePrefetcher;
