import { observer } from 'mobx-react-lite';

// import local files
import Dropdown from '../../../ui/dropdown';
import useDropdown from '../../../../hooks/useDropdown';
import { listOfFonts } from '../../../../constant/status';
import useStatusPageContext from '../../../../context/status-page';

const StatusConfigureAppearanceFont = () => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();
  const {
    settings: { font = 'Montserrat' },
    changeValues,
  } = useStatusPageContext;

  return (
    <div>
      <label className="input-label">Font style</label>
      <Dropdown.Container
        toggleDropdown={toggleDropdown}
        isOpen={dropdownIsOpen}
      >
        <Dropdown.Trigger
          asInput
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          <div style={{ fontFamily: font }}>{font}</div>
        </Dropdown.Trigger>
        <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
          {listOfFonts.map((fontFamily) => (
            <Dropdown.Item
              key={fontFamily}
              showDot
              isSelected={fontFamily === font}
              dotColor={'primary'}
              onClick={() => {
                changeValues({ font: fontFamily });
                toggleDropdown();
              }}
            >
              <div style={{ fontFamily: fontFamily }}>{fontFamily}</div>
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </div>
  );
};

StatusConfigureAppearanceFont.displayName = 'StatusConfigureAppearanceFont';

StatusConfigureAppearanceFont.propTypes = {};

export default observer(StatusConfigureAppearanceFont);
