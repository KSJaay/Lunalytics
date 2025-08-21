import './style.scss';

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
    useDropdown(true, monitors[0]?.monitorId);

  if (!monitors[0]) return null;

  const activeMonitor = monitors.find(
    (monitor) => monitor.monitorId === selectedId
  );
  const activeHeartbeats = heartbeats
    ? heartbeats[selectedId]
    : defaultHeartbeats;

  return (
    <div className="spm-container">
      <div style={{ display: 'flex', gap: '12px' }}>
        <div
          className="spm-title"
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
                {activeMonitor?.name}
              </div>
            </Dropdown.Trigger>
            <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
              {monitors.map((monitor) => (
                <Dropdown.Item
                  key={monitor.monitorId}
                  onClick={() => {
                    handleDropdownSelect(monitor.monitorId);
                  }}
                >
                  {monitor.name}
                </Dropdown.Item>
              ))}
            </Dropdown.List>
          </Dropdown.Container>
        </div>
      </div>

      <div className="spm-content">
        <StatusPageMetricsBasicGraph
          title={showName ? activeMonitor?.name : false}
          showPing={showPing}
          heartbeats={activeHeartbeats}
        />
      </div>
    </div>
  );
};

StatusPageMetricsDropdown.displayName = 'StatusPageMetricsDropdown';

export default StatusPageMetricsDropdown;
