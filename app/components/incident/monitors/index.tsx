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

interface IncidentMonitorsProps {
  values?: {
    monitorIds: string[];
    affect: string;
  };
  handleSelectedMonitor: (id: string) => void;
  handleChange: (field: string, value: string) => void;
}

const IncidentMonitors = ({
  values,
  handleSelectedMonitor,
  handleChange,
}: IncidentMonitorsProps) => {
  const { monitorIds = [], affect } = values || {};
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const selectedStatusInformation = getIncidentAffect(affect, false);

  const color =
    typeof selectedStatusInformation === 'object' &&
    selectedStatusInformation !== null
      ? selectedStatusInformation.color
      : undefined;
  const text =
    typeof selectedStatusInformation === 'object' &&
    selectedStatusInformation !== null
      ? selectedStatusInformation.text
      : selectedStatusInformation;

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
                <div style={{ color }}>{text}</div>
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
