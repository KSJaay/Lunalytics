import './style.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import Dropdown from '../../../../ui/dropdown';
import StatusPageMetricsBasicGraph from './graph/basic';
import useDropdown from '../../../../../hooks/useDropdown';
import { defaultHeartbeats } from '../../../../../constant/status';

const StatusPageMetricsDropdown = ({
  monitors,
  title,
  showName,
  showPing,
  heartbeats,
}) => {
  const { dropdownIsOpen, toggleDropdown, selectedId, handleDropdownSelect } =
    useDropdown(true, monitors[0]?.id);

  if (!monitors[0]) return null;

  const activeMonitor = monitors.find((monitor) => monitor.id === selectedId);
  const activeHeartbeats = heartbeats
    ? heartbeats[selectedId]
    : defaultHeartbeats;

  return (
    <div className="status-page-metrics-container">
      <div style={{ display: 'flex', gap: '12px' }}>
        <div
          className="status-page-metrics-title"
          style={{ flex: 1, display: 'flex', alignItems: 'center' }}
        >
          {title}
        </div>
        <div>
          <Dropdown.Container
            position="left"
            isOpen={dropdownIsOpen}
            toggleDropdown={toggleDropdown}
          >
            <Dropdown.Trigger
              isOpen={dropdownIsOpen}
              toggleDropdown={toggleDropdown}
              asInput
              style={{ width: '250px' }}
            >
              <div className="status-page-metrics-dropdown-trigger">
                {activeMonitor.title}
              </div>
            </Dropdown.Trigger>
            <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
              {monitors.map((monitor) => (
                <Dropdown.Item
                  key={monitor.id}
                  onClick={() => {
                    handleDropdownSelect(monitor.id);
                  }}
                >
                  {monitor.title}
                </Dropdown.Item>
              ))}
            </Dropdown.List>
          </Dropdown.Container>
        </div>
      </div>

      <div className="status-page-metrics-content">
        <StatusPageMetricsBasicGraph
          title={showName ? activeMonitor.title : false}
          showPing={showPing}
          heartbeats={activeHeartbeats}
        />
      </div>
    </div>
  );
};

StatusPageMetricsDropdown.displayName = 'StatusPageMetricsDropdown';

StatusPageMetricsDropdown.propTypes = {
  monitors: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  showName: PropTypes.bool.isRequired,
  showPing: PropTypes.bool.isRequired,
  heartbeats: PropTypes.object,
};

export default StatusPageMetricsDropdown;
