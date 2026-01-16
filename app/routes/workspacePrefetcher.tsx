import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useContextStore from '../context';
import Loading from '../components/ui/loading';
import useFetch from '../hooks/useFetch';
import { fetchMonitorById } from '../services/monitor/fetch';
import { observer } from 'mobx-react-lite';

const pageConfigs = [
  {
    path: '/incidents',
    hasLoaded: (store: any) => store.incidentStore.hasLoadedIncidents,
    setData: (store: any, data: any) => store.incidentStore.setIncidents(data),
    url: '/api/workspace/incidents',
    loadingUrl: '/incidents',
  },
  {
    path: '/monitors',
    hasLoaded: (store: any) => store.globalStore.hasLoadedMonitors,
    setData: (store: any, data: any) => {
      store.globalStore.setMonitors(data);
      store.globalStore.setTimeouts(data, fetchMonitorById);
    },
    url: '/api/workspace/monitors',
    loadingUrl: '/home',
  },
  {
    path: '/notifications',
    hasLoaded: (store: any) => store.notificationStore.hasLoadedNotifications,
    setData: (store: any, data: any) =>
      store.notificationStore.setNotifications(data),
    url: '/api/workspace/notifications',
    loadingUrl: '/notifications',
  },
  {
    path: '/status-pages',
    hasLoaded: (store: any) => store.statusStore.hasLoadedStatusPages,
    setData: (store: any, data: any) => store.statusStore.setStatusPages(data),
    url: '/api/workspace/status-pages',
    loadingUrl: '/status-pages',
  },
];

function getPageConfig(pathname: string) {
  return pageConfigs.find((cfg) => pathname.startsWith(cfg.path));
}

const WorkspacePrefetcher = observer(
  ({ children }: { children: React.ReactNode }) => {
    const store = useContextStore();
    const location = useLocation();

    const [prefetched, setPrefetched] = useState(false);
    const prefetchedRef = useRef(false);

    const currentConfig = useMemo(
      () => getPageConfig(location.pathname) || pageConfigs[0],
      [location.pathname]
    );

    const { isLoading } = useFetch({
      hasFetched: currentConfig.hasLoaded(store),
      url: currentConfig.url,
      onSuccess: (data) => {
        currentConfig.setData(store, data);
      },
      onFailure: () => {},
    });

    useEffect(() => {
      if (!isLoading && !prefetchedRef.current) {
        prefetchedRef.current = true;
        setPrefetched(true);
        pageConfigs.forEach((cfg) => {
          if (cfg !== currentConfig && !cfg.hasLoaded(store)) {
            fetch(cfg.url)
              .then((res) => (res.ok ? res.json() : null))
              .then((data) => {
                if (data) cfg.setData(store, data);
              })
              .catch(() => {});
          }
        });
      }
    }, [isLoading, currentConfig, store]);

    if (isLoading) {
      return <Loading asContainer activeUrl={currentConfig.loadingUrl} />;
    }

    return children;
  }
);

export default WorkspacePrefetcher;
