import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '../components/ui/loading';
import useFetch from '../hooks/useFetch';
import { fetchMonitorById } from '../services/monitor/fetch';
import { observer } from 'mobx-react-lite';
import { createGetRequest } from '../services/axios';
import useNotificationContext from '../context/notifications';
import useUserContext from '../context/user';
import useGlobalContext from '../context/global';
import useIncidentContext from '../context/incidents';
import useStatusContext from '../context/status';
import useModalContext from '../context/modal';

const pageConfigs = [
  {
    path: '/incidents',
    hasLoaded: (store: any) => store.incidentStore.hasLoadedIncidents,
    setData: (store: any, data: any) => store.incidentStore.setIncidents(data),
    url: '/api/workspace/incidents',
    loadingUrl: '/incidents',
  },
  {
    path: '/home',
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
    const location = useLocation();

    const contextStore = {
      notificationStore: useNotificationContext(),
      userStore: useUserContext(),
      globalStore: useGlobalContext(),
      incidentStore: useIncidentContext(),
      statusStore: useStatusContext(),
      modalStore: useModalContext(),
    };

    const [_, setPrefetched] = useState(false);
    const prefetchedRef = useRef(false);

    const currentConfig = useMemo(
      () => getPageConfig(location.pathname) || pageConfigs[0],
      [location.pathname]
    );

    const { isLoading } = useFetch({
      hasFetched: currentConfig.hasLoaded(contextStore),
      url: currentConfig.url,
      onSuccess: (data) => {
        currentConfig.setData(contextStore, data);
      },
      onFailure: () => {},
    });
    3;

    useEffect(() => {
      if (!isLoading && !prefetchedRef.current) {
        prefetchedRef.current = true;
        setPrefetched(true);
        pageConfigs.forEach((cfg) => {
          if (cfg !== currentConfig && !cfg.hasLoaded(contextStore)) {
            createGetRequest(cfg.url)
              .then((data) => {
                cfg.setData(contextStore, data?.data);
              })
              .catch(() => {});
          }
        });
      }
    }, [isLoading, currentConfig, contextStore]);

    if (isLoading) {
      return <Loading asContainer activeUrl={currentConfig.loadingUrl} />;
    }

    return children;
  }
);

export default WorkspacePrefetcher;
