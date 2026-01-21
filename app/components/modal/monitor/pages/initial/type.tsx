// import local files
import { MonitorType } from '../../../../../../shared/types/monitor';
import useDropdown from '../../../../../hooks/useDropdown';
import Dropdown from '../../../../ui/dropdown';

const textInputTypes = {
  dns: 'DNS',
  docker: 'Docker Container',
  gamedig: 'GameDig',
  http: 'HTTP',
  json: 'JSON Query',
  ping: 'Ping',
  push: 'Push',
  tcp: 'TCP',
};

interface InputProps {
  type: MonitorType;
  [key: string]: any;
}

interface MonitorInitialDropdownProps {
  inputs: InputProps;
  errors: any;
  handleInput: (key: string, value: any) => void;
}

const MonitorInitialDropdown = ({
  inputs,
  errors,
  handleInput,
}: MonitorInitialDropdownProps) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();
  return (
    <div className="luna-input-wrapper">
      <label className="input-label">Monitor Type</label>
      <label className="luna-input-subtitle">
        Select the type of monitor you want to setup
      </label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          id="type-dropdown"
          color="var(--lunaui-accent-900)"
        >
          {textInputTypes[inputs.type] || 'Select Monitor Type'}
        </Dropdown.Trigger>
        <Dropdown.List fullWidth isOpen={dropdownIsOpen}>
          <Dropdown.Item
            id="type-dns"
            onClick={() => {
              handleInput('type', 'dns');
              toggleDropdown();
            }}
          >
            {textInputTypes.dns}
          </Dropdown.Item>

          <Dropdown.Item
            id="type-docker"
            onClick={() => {
              handleInput('type', 'docker');
              toggleDropdown();
            }}
          >
            {textInputTypes.docker}
          </Dropdown.Item>

          <Dropdown.Item
            id="type-gamedig"
            onClick={() => {
              handleInput('type', 'gamedig');
              toggleDropdown();
            }}
          >
            {textInputTypes.gamedig}
          </Dropdown.Item>

          <Dropdown.Item
            id="type-http"
            onClick={() => {
              handleInput('type', 'http');
              toggleDropdown();
            }}
          >
            {textInputTypes.http}
          </Dropdown.Item>

          <Dropdown.Item
            id="type-json"
            onClick={() => {
              handleInput('type', 'json');
              toggleDropdown();
            }}
          >
            {textInputTypes['json']}
          </Dropdown.Item>

          <Dropdown.Item
            id="type-ping"
            onClick={() => {
              handleInput('type', 'ping');
              toggleDropdown();
            }}
          >
            {textInputTypes.ping}
          </Dropdown.Item>

          <Dropdown.Item
            id="type-push"
            onClick={() => {
              handleInput('type', 'push');
              toggleDropdown();
            }}
          >
            {textInputTypes.push}
          </Dropdown.Item>

          <Dropdown.Item
            id="type-tcp"
            onClick={() => {
              handleInput('type', 'tcp');
              toggleDropdown();
            }}
          >
            {textInputTypes.tcp}
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown.Container>
      {errors.type && (
        <label id="text-input-error-input-type" className="input-error">
          {errors.type}
        </label>
      )}
    </div>
  );
};

MonitorInitialDropdown.displayName = 'MonitorInitialDropdown';

export default MonitorInitialDropdown;
