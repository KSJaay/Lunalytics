// import styles
import '../../styles/pages/notifications.scss';

// import dependencies
import { Button } from '@lunalytics/ui';
import { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../context';
import Navigation from '../../components/navigation';
import NotificationModal from '../../components/modal/notification';
import HomeStatusPageHeader from '../../components/status/header';
import StatusConfigureContent from '../../components/status/content';
import StatusPageList from '../../components/status/list';
import StatusConfigureProvider from '../../components/status/content/provider';

const Notifications = () => {
  const {
    modalStore: { openModal, closeModal },
    statusStore: { allStatusPages, getStatusById },
  } = useContextStore();

  const [search, setSearch] = useState(null);
  const [activeStatusPage, setActiveStatusPage] = useState(null);
  const [activePage, setActivePage] = useState('Appearance');

  useEffect(() => {
    if (!activeStatusPage && allStatusPages[0]) {
      setActiveStatusPage(allStatusPages[0]);
    }
  }, [allStatusPages, activeStatusPage]);

  const handleSearchUpdate = (search = '') => {
    setSearch(search.trim());
  };

  const statusPages = useMemo(
    () =>
      allStatusPages.filter((statusPage) => {
        if (search) {
          const lowercaseSearch = search?.toLowerCase() || '';
          return (
            statusPage?.statusUrl?.toLowerCase()?.includes(lowercaseSearch) ||
            statusPage?.settings?.title
              ?.toLowerCase()
              ?.includes(lowercaseSearch)
          );
        }
        return true;
      }),
    [search, allStatusPages]
  );

  const addNotification = () => {};

  return (
    <Navigation
      activeUrl="/status-pages"
      handleSearchUpdate={handleSearchUpdate}
      leftChildren={
        <StatusPageList
          statusPages={statusPages}
          activeStatusPage={activeStatusPage}
          setActiveStatusPage={setActiveStatusPage}
        />
      }
      leftButton={
        <Button
          variant="flat"
          fullWidth
          onClick={() =>
            openModal(
              <NotificationModal
                closeModal={closeModal}
                addNotification={addNotification}
              />,
              false
            )
          }
        >
          Add Status Page
        </Button>
      }
      onLeftClick={() => {}}
      header={{
        props: {
          statusPage: activeStatusPage,
          setActiveStatusPage,
          activePage,
          setActivePage,
        },
        HeaderComponent: HomeStatusPageHeader,
      }}
    >
      {!activeStatusPage ? (
        <div
          style={{
            height: '100%',
            width: '100%',
            fontWeight: 'bold',
            fontSize: 'var(--font-2xl)',
            color: 'var(--font-light-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div>No status pages found</div>
        </div>
      ) : (
        <div>
          <div style={{ padding: '1rem 1rem 7rem 1rem' }}>
            <StatusConfigureProvider activeStatusPage={activeStatusPage}>
              <StatusConfigureContent
                currentTab={activePage}
                activeStatusId={activeStatusPage?.statusId}
                getStatusById={getStatusById}
              />
            </StatusConfigureProvider>
          </div>
        </div>
      )}
    </Navigation>
  );
};

Notifications.displayName = 'Notifications';

Notifications.propTypes = {};

export default observer(Notifications);
