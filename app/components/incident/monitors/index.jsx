// import dependencies
import { observer } from 'mobx-react-lite';

// import local files
import IncidentMonitorsList from './list';
import Dropdown from '../../ui/dropdown';
import useDropdown from '../../../hooks/useDropdown';

const statusText = [
  {
    id: 'Operational',
    text: 'All Systems Operational',
    color: 'var(--green-600)',
  },
  // {
  //   id: 'Maintenance',
  //   text: 'Scheduled Maintenance',
  //   color: 'var(--blue-600)',
  // },
  {
    id: 'Incident',
    text: 'Partially Degraded Service',
    color: 'var(--yellow-600)',
  },
  {
    id: 'Outage',
    text: 'Major Outage',
    color: 'var(--red-600)',
  },
];

const IncidentMonitors = ({
  values = {},
  handleSelectedMonitor,
  handleChange,
}) => {
  const { monitorIds, affect } = values;
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const selectedStatusInforamtion = statusText.find(
    (item) => item.id === affect
  );

  return (
    <div>
      <div className="icm-container">
        <div className="icm-title">
          <div className="input-label">Affected Monitors</div>
          <div className="input-short-description">
            Select the monitors that are affected by this incident.
          </div>
        </div>
        {handleChange && (
          <div className="icm-dropdown">
            <Dropdown.Container
              toggleDropdown={toggleDropdown}
              isOpen={dropdownIsOpen}
            >
              <Dropdown.Trigger
                asInput
                isOpen={dropdownIsOpen}
                toggleDropdown={toggleDropdown}
              >
                <div style={{ color: selectedStatusInforamtion.color }}>
                  {selectedStatusInforamtion.text}
                </div>
              </Dropdown.Trigger>
              <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
                {statusText.map((item) => {
                  const { id, color, text } = item;

                  return (
                    <Dropdown.Item
                      key={id}
                      style={{ color }}
                      showDot
                      isSelected={id === affect}
                      onClick={() => handleChange('affect', id)}
                    >
                      {text}
                    </Dropdown.Item>
                  );
                })}
              </Dropdown.List>
            </Dropdown.Container>
          </div>
        )}
      </div>

      <IncidentMonitorsList
        selectedMonitors={monitorIds}
        handleSelected={handleSelectedMonitor}
      />
    </div>
  );
};

export default observer(IncidentMonitors);
