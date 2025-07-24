// import styles
import '../styles/pages/notifications.scss';

// import dependencies
import { Button } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';

// import local files
import useContextStore from '../context';
import Navigation from '../components/navigation';
import HomeStatusPageHeader from '../components/status/header';
import StatusConfigureContent from '../components/status/content';
import StatusPageList from '../components/status/list';
import StatusConfigurCreateModal from '../components/modal/status/configure';
import useStatusPageContext from '../context/status-page';
import { toJS } from 'mobx';
import { filterData } from '../../shared/utils/search';

const Notifications = () => {
  const {
    modalStore: { openModal, closeModal },
    statusStore: { allStatusPages, activeStatusPage, setActiveStatusPage },
  } = useContextStore();
  const { setData } = useStatusPageContext;

  const [search, setSearch] = useState(null);
  const [activePage, setActivePage] = useState('Appearance');

  useEffect(() => {
    if (!activeStatusPage && allStatusPages[0]) {
      setActiveStatusPage(allStatusPages[0].statusId);
      setData(toJS(allStatusPages[0]));
    }

    if (activeStatusPage) {
      setData(toJS(activeStatusPage));
    }
  }, [allStatusPages, activeStatusPage]);

  const handleSearchUpdate = (search = '') => {
    setSearch(search.trim());
  };

  const statusPages = useMemo(() => {
    if (!search) return allStatusPages;

    return filterData(allStatusPages, search, ['statusUrl', 'settings.title']);
  }, [search, allStatusPages]);

  return (
    <Navigation
      activeUrl="/status-pages"
      handleSearchUpdate={handleSearchUpdate}
      leftChildren={<StatusPageList statusPages={statusPages} />}
      leftButton={
        <Button
          variant="flat"
          fullWidth
          onClick={() =>
            openModal(
              <StatusConfigurCreateModal closeModal={closeModal} />,
              false
            )
          }
        >
          Add Status Page
        </Button>
      }
      onLeftClick={() => {}}
      header={{
        props: { activePage, setActivePage },
        HeaderComponent: HomeStatusPageHeader,
      }}
    >
      {!activeStatusPage ? (
        <div className="monitor-none-exist">
          <div>No status pages found</div>
        </div>
      ) : (
        <div>
          <div style={{ padding: '1rem 1rem 7rem 1rem' }}>
            <StatusConfigureContent currentTab={activePage} />
          </div>
        </div>
      )}
    </Navigation>
  );
};

Notifications.displayName = 'Notifications';

Notifications.propTypes = {};

export default observer(Notifications);
