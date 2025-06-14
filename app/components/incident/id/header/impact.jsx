// import dependencies
import { useState } from 'react';
import { MdEdit } from 'react-icons/md';

// import local files
import useDropdown from '../../../../hooks/useDropdown';
import Dropdown from '../../../ui/dropdown';
import {
  affectTextArray,
  getIncidentAffect,
} from '../../../../../shared/constants/incident';

const IncidentIdHeaderItemImpact = ({ title, onClick, subtitle }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  const affected = getIncidentAffect(subtitle);

  const [active, setActive] = useState(affected);

  const handleClick = async (id) => {
    const affect = getIncidentAffect(id);

    setActive(affect);
    await onClick('affect', id);
  };

  return (
    <div className="iidh-item">
      <div style={{ display: 'flex' }}>
        <div className="title">{title}</div>
        {onClick && (
          <Dropdown.Container
            toggleDropdown={toggleDropdown}
            isOpen={dropdownIsOpen}
            position="center"
          >
            <Dropdown.Trigger
              toggleDropdown={toggleDropdown}
              isOpen={dropdownIsOpen}
            >
              <span>
                <MdEdit size={18} />
              </span>
            </Dropdown.Trigger>
            <Dropdown.List isOpen={dropdownIsOpen}>
              {affectTextArray.map((item) => {
                const { id, color, text } = item;

                return (
                  <Dropdown.Item
                    key={id}
                    style={{ color }}
                    showDot
                    isSelected={id === active?.id}
                    onClick={() => handleClick(id)}
                  >
                    {text}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.List>
          </Dropdown.Container>
        )}
      </div>
      <div className="subtitle">{active?.text}</div>
    </div>
  );
};

export default IncidentIdHeaderItemImpact;
