import { FaLock, FaLockOpen } from 'react-icons/fa';
import './styles.scss';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';

const StatusPageList = ({ statusPages }) => {
  const {
    statusStore: { activeStatusPage, setActiveStatusPage },
  } = useContextStore();

  if (!statusPages || statusPages.length === 0) {
    return <div style={{ flex: 1 }}></div>;
  }

  return (
    <div className="navigation-status-page-items">
      {statusPages.map((statusPage) => {
        const classes = classNames('item', {
          active: statusPage.statusId === activeStatusPage?.statusId,
        });

        return (
          <div
            key={statusPage.statusId}
            className={classes}
            onClick={() => setActiveStatusPage(statusPage.statusId)}
          >
            <div className="content">
              <div>{statusPage.settings.title}</div>
              <div className="url">
                {statusPage.statusUrl === 'default'
                  ? '/'
                  : `/status/${statusPage.statusUrl}`}
              </div>
            </div>
            <div className="icon-container">
              {statusPage.settings.isPublic ? (
                <FaLockOpen size={20} />
              ) : (
                <FaLock size={20} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default observer(StatusPageList);
