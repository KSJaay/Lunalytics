import { toast } from 'react-toastify';

// import local files
import Dropdown from '../../ui/dropdown';
import useDropdown from '../../../hooks/useDropdown';
import { useMemo } from 'react';
import useContextStore from '../../../context';
import { createPostRequest } from '../../../services/axios';

const impactTypes = [
  { id: 'Outage', text: 'Major Outage', color: 'var(--red-700)' },
  {
    id: 'Incident',
    text: 'Partially Degraded Service',
    color: 'var(--yellow-700)',
  },
  // { id: 'Maintenance',text: 'Scheduled Maintenance', color: 'var(--blue-700)' },
  {
    id: 'Operational',
    text: 'All Systems Operational',
    color: 'var(--green-700)',
  },
];

const IncidentContentImpact = () => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const {
    incidentStore: { addIncident, activeIncident: incident },
  } = useContextStore();

  const updateIncidentImpact = async (id: string) => {
    try {
      toggleDropdown();
      const typeExists = impactTypes.find((type) => type.id === id);

      if (!typeExists) {
        return toast.error('Invalid type provided');
      }

      const response = await createPostRequest('/api/incident/update', {
        incident: { ...incident, affect: id },
      });

      addIncident(response.data);
      toast.success('Incident title has been updated successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong! Please try again later.');
    }
  };

  const selectedImpact = useMemo(() => {
    return impactTypes.find((type) => type.id === incident?.affect);
  }, [incident?.affect]);

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
          <div style={{ color: selectedImpact?.color }}>
            {selectedImpact?.text}
          </div>
        </Dropdown.Trigger>
        <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
          {impactTypes.map((type) => (
            <Dropdown.Item
              key={type.id}
              style={{ color: type.color }}
              onClick={() => updateIncidentImpact(type.id)}
            >
              {type.text}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

IncidentContentImpact.displayName = 'IncidentContentImpact';

export default IncidentContentImpact;
