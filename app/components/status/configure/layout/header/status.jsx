// import dependencies
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import { PiDotsSixVerticalBold } from '../../../../icons';
import useStatusPageContext from '../../../../../context/status-page';

const StatusConfigureLayoutHeaderStatus = ({ componentId }) => {
  const { getComponent } = useStatusPageContext;

  const {
    status: { showTitle, showStatus, titleSize, statusSize, alignment },
  } = getComponent(componentId);

  const date = dayjs().format('HH:mm:ss');

  return (
    <div
      data-swapy-item="status"
      className={`sclh-status-container ${alignment}`}
    >
      {showTitle || showStatus ? (
        <div className="sclh-status-handle-button">
          <PiDotsSixVerticalBold style={{ width: '24px', height: '24px' }} />
        </div>
      ) : null}
      <div>
        {showTitle ? (
          <div className={`sclh-status-title ${titleSize}`}>Service Status</div>
        ) : null}
        {showStatus ? (
          <div className={`sclh-status-subtitle ${statusSize}`}>
            <div>Last check: {date}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

StatusConfigureLayoutHeaderStatus.displayName =
  'StatusConfigureLayoutHeaderStatus';

StatusConfigureLayoutHeaderStatus.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default observer(StatusConfigureLayoutHeaderStatus);
