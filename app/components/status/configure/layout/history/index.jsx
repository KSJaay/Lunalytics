import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import { FaTrashCan } from '../../../../icons';
import StatusConfigureLayoutHistoryList from './list';
import useStatusContext from '../../../../../hooks/useConfigureStatus';

const StatusConfigureLayoutHistory = ({ componentId, incidents = [] }) => {
  const { removeComponent } = useStatusContext();

  return (
    <div className="status-configure-content-block">
      <div className="status-configure-content-title">Incidents History</div>
      <div className="status-configure-content-description">
        Will display the last 15 days, and if any incidents have occurred
        it&#39;ll show information about them.
      </div>

      <div className="status-configure-layout-menu">
        <div
          className="status-configure-layout-bin"
          onClick={() => removeComponent(componentId)}
        >
          <FaTrashCan style={{ width: '20px', height: '20px' }} />
        </div>
      </div>

      <div className="status-configure-layout-header-content">
        <StatusConfigureLayoutHistoryList incidents={incidents} size={3} />
      </div>
    </div>
  );
};

StatusConfigureLayoutHistory.displayName = 'StatusConfigureLayoutHistory';

StatusConfigureLayoutHistory.propTypes = {
  componentId: PropTypes.string.isRequired,
  incidents: PropTypes.array.isRequired,
};

export default StatusConfigureLayoutHistory;
