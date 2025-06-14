// import dependencies
import { observer } from 'mobx-react-lite';

// import local files
import IncidentMonitorsList from './list';
import Dropdown from '../../ui/dropdown';
import useDropdown from '../../../hooks/useDropdown';
import {
  affectTextArray,
  getIncidentAffect,
} from '../../../../shared/constants/incident';

const IncidentMonitors = ({
  values = {},
  handleSelectedMonitor,
  handleChange,
}) => {
  const { monitorIds, affect } = values;
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const selectedStatusInforamtion = getIncidentAffect(affect);

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
                {affectTextArray.map(({ id, color, text }) => (
                  <Dropdown.Item
                    key={id}
                    style={{ color }}
                    showDot
                    isSelected={id === affect}
                    onClick={() => handleChange('affect', id)}
                  >
                    {text}
                  </Dropdown.Item>
                ))}
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
