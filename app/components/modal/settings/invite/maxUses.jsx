// import dependencies
import PropTypes from 'prop-types';

// import local files
import Dropdown from '../../../ui/dropdown';
import useDropdown from '../../../../hooks/useDropdown';

const limits = [1, 5, 10, 25, 50, 100];

const CreateInviteMaxUses = ({ setMaxUses, maxUses }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <>
      <label className="input-label">Max number of uses</label>
      <Dropdown.Container
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          {!maxUses ? 'No limit' : `${maxUses} uses`}
        </Dropdown.Trigger>
        <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
          <Dropdown.Item onClick={() => setMaxUses(null)}>
            No limit
          </Dropdown.Item>
          {limits.map((limit) => (
            <Dropdown.Item
              key={limit}
              onClick={() => {
                setMaxUses(limit);
                toggleDropdown();
              }}
            >
              {limit} uses
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

CreateInviteMaxUses.displayName = 'CreateInviteMaxUses';

CreateInviteMaxUses.propTypes = {
  setMaxUses: PropTypes.func.isRequired,
};

export default CreateInviteMaxUses;
