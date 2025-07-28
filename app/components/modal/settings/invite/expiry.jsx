// import dependencies
import PropTypes from 'prop-types';
import { useMemo } from 'react';

// import local files
import Dropdown from '../../../ui/dropdown';
import useDropdown from '../../../../hooks/useDropdown';

const limits = [
  { value: '30 minutes', text: '30 minutes' },
  { value: '1 hours', text: '1 hour' },
  { value: '6 hours', text: '6 hours' },
  { value: '12 hours', text: '12 hours' },
  { value: '1 days', text: '1 day' },
  { value: '7 days', text: '7 days' },
  { value: null, text: 'Never' },
];

const CreateInviteExpiry = ({ setExpiryId, expiryId }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const selectedLimit = useMemo(() => {
    return (
      limits.find((limit) => limit.value === expiryId) ||
      limits[limits.length - 1]
    );
  }, [expiryId]);

  return (
    <>
      <label className="input-label">Expire After</label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          {selectedLimit.text}
        </Dropdown.Trigger>
        <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
          {limits.map((limit) => (
            <Dropdown.Item
              key={limit.value}
              onClick={() => {
                setExpiryId(limit.value);
                toggleDropdown();
              }}
            >
              {limit.text}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

CreateInviteExpiry.displayName = 'CreateInviteExpiry';

CreateInviteExpiry.propTypes = {
  expiryId: PropTypes.string,
  setExpiryId: PropTypes.func.isRequired,
};

export default CreateInviteExpiry;
