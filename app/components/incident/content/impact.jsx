// import local files
import Dropdown from '../../ui/dropdown';
import useDropdown from '../../../hooks/useDropdown';

const IncidentContentImpact = ({ incident }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <>
      <label className="input-label">Impact</label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          {incident.affect}
        </Dropdown.Trigger>
        <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
          <Dropdown.Item style={{ color: 'var(--red-700)' }} onClick={() => {}}>
            Investigating
          </Dropdown.Item>
          <Dropdown.Item style={{ color: 'var(--yellow-700)' }}>
            Identified
          </Dropdown.Item>
          <Dropdown.Item style={{ color: 'var(--blue-700)' }}>
            Monitoring
          </Dropdown.Item>
          <Dropdown.Item style={{ color: 'var(--green-700)' }}>
            Resolved
          </Dropdown.Item>
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

IncidentContentImpact.displayName = 'IncidentContentImpact';

IncidentContentImpact.propTypes = {};

export default IncidentContentImpact;
