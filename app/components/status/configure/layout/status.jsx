import './status.scss';

// import dependencies
import PropTypes from 'prop-types';
import { FiMinimize, FiMaximize } from 'react-icons/fi';

// import local files
import {
  FaCircleCheck,
  FaClock,
  FaTrashCan,
  IoWarning,
  RiIndeterminateCircleFill,
} from '../../../icons';
import useStatusContext from '../../../../hooks/useConfigureStatus';
import Tabs from '../../../ui/tabs';
import {
  statusAlignments,
  statusBarDesign,
} from '../../../../../shared/constants/status';

const icons = {
  Operational: <FaCircleCheck style={{ width: '32px', height: '32px' }} />,
  Maintenance: <FaClock style={{ width: '32px', height: '32px' }} />,
  Incident: <IoWarning style={{ width: '32px', height: '32px' }} />,
  Outage: (
    <RiIndeterminateCircleFill style={{ width: '32px', height: '32px' }} />
  ),
};

const statusText = {
  Operational: 'All Systems Operational',
  Maintenance: 'Scheduled Maintenance',
  Incident: 'Partially Degraded Service',
  Outage: 'Degraded Service',
};

const StatusConfigureLayoutStatus = ({ componentId }) => {
  const { setComponentValue, getComponent, removeComponent } =
    useStatusContext();
  const { icon, design, size, status, titleSize, isMinimized } =
    getComponent(componentId);

  return (
    <>
      <div className="status-configure-content-block">
        <div className="status-configure-content-title">Status</div>

        <div className="status-configure-layout-menu">
          <div
            className="status-configure-layout-minimize"
            onClick={() =>
              setComponentValue(componentId, 'isMinimized', !isMinimized)
            }
          >
            {isMinimized ? (
              <FiMaximize style={{ width: '20px', height: '20px' }} />
            ) : (
              <FiMinimize style={{ width: '20px', height: '20px' }} />
            )}
          </div>

          <div
            className="status-configure-layout-bin"
            onClick={() => removeComponent(componentId)}
          >
            <FaTrashCan style={{ width: '20px', height: '20px' }} />
          </div>
        </div>

        <div
          className={`status-configure-status-content ${size} ${design} ${status}`}
        >
          <div className={`status-configure-status-title ${titleSize}`}>
            {icon ? icons[status] : null}
            {statusText[status]}
          </div>
        </div>

        {!isMinimized && (
          <div className="status-configure-status-options">
            <div style={{ flex: 1 }}>
              <Tabs
                label="Incident color"
                options={['Operational', 'Maintenance', 'Incident', 'Outage']}
                activeOption={status}
                onChange={(e) => setComponentValue(componentId, 'status', e)}
                shortDescription="This is for testing only and will not be saved"
              />
              <Tabs
                label="Banner size"
                options={statusAlignments}
                activeOption={size}
                onChange={(e) => setComponentValue(componentId, 'size', e)}
                shortDescription="Change the size of the status banner"
              />
              <Tabs
                label="Title size"
                options={statusAlignments}
                activeOption={titleSize}
                onChange={(e) => setComponentValue(componentId, 'titleSize', e)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Tabs
                label="Show icon"
                options={['Enable', 'Disable']}
                activeOption={icon ? 'Enable' : 'Disable'}
                onChange={(e) =>
                  setComponentValue(componentId, 'icon', e === 'Enable')
                }
                shortDescription="Show the status icon"
              />
              <Tabs
                label="Design"
                options={statusBarDesign}
                activeOption={design}
                onChange={(e) => setComponentValue(componentId, 'design', e)}
                shortDescription="Change the design of the status banner"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

StatusConfigureLayoutStatus.displayName = 'StatusConfigureLayoutStatus';

StatusConfigureLayoutStatus.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default StatusConfigureLayoutStatus;
