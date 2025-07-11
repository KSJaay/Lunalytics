import { FaLock } from 'react-icons/fa';
import './styles.scss';

import classNames from 'classnames';

const StatusPageList = ({
  statusPages,
  activeStatusPage,
  setActiveStatusPage,
}) => {
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
            onClick={() => setActiveStatusPage(statusPage)}
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
              <FaLock style={{ width: '20px', height: '20px' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusPageList;
