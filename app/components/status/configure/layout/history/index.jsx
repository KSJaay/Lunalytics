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
    <div className="scc-block">
      <div className="scc-title">Incidents History</div>
      <div className="scc-description">
        Will display the last 15 days, and if any incidents have occurred
        it&#39;ll show information about them.
      </div>

      <div className="scl-menu">
        <div className="scl-bin" onClick={() => removeComponent(componentId)}>
          <FaTrashCan style={{ width: '20px', height: '20px' }} />
        </div>
      </div>

      <div className="sclh-content">
        <StatusConfigureLayoutHistoryList
          incidents={incidents}
          size={3}
          style={{ maxWidth: '100%' }}
        />
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
