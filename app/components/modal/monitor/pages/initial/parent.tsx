import { observer } from 'mobx-react-lite';
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';
import useContextStore from '../../../../../context';

const MonitorParentSelect = ({
  inputs,
  handleInput,
}: {
  inputs: any;
  handleInput: (key: string, value: any) => void;
}) => {
  const {
    globalStore: { allMonitors },
  } = useContextStore();
  const { toggleDropdown, dropdownIsOpen } = useDropdown(true);

  const onSelect = (monitorId: string | null) => {
    handleInput('parentId', monitorId);
    toggleDropdown();
  };

  const monitors = allMonitors.filter(
    (monitor) => monitor.monitorId !== inputs.monitorId
  );

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">Monitor Parent</label>
      <label className="luna-input-subtitle">
        If parent is down notification won&#39;t be sent for this monitor
      </label>

      <div>
        <Dropdown.Container
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          position="center"
        >
          <Dropdown.Trigger
            isOpen={dropdownIsOpen}
            toggleDropdown={toggleDropdown}
            color="var(--lunaui-accent-900)"
            asInput
          >
            {inputs.parentId
              ? monitors.find(
                  (monitor) => monitor.monitorId === inputs.parentId
                )?.name
              : 'No parent'}
          </Dropdown.Trigger>
          <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
            <Dropdown.Item onClick={() => onSelect(null)}>
              No parent
            </Dropdown.Item>
            {monitors.map((monitor) => (
              <Dropdown.Item
                key={monitor.monitorId}
                onClick={() => onSelect(monitor.monitorId)}
              >
                <img
                  src={monitor?.icon?.url}
                  style={{ width: '20px', height: '20px' }}
                />
                {monitor.name}
              </Dropdown.Item>
            ))}
          </Dropdown.List>
        </Dropdown.Container>
      </div>
    </div>
  );
};

export default observer(MonitorParentSelect);
