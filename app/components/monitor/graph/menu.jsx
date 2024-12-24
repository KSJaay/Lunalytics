// import dependencies
import PropTypes from 'prop-types';

// import local files
import Button from '../../ui/button';
import Dropdown from '../../ui/dropdown';
import useDropdown from '../../../hooks/useDropdown';
import { FaEllipsisVertical } from '../../icons';

const GraphMenu = ({ statusType, setStatusType, showFilters }) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();

  return (
    <>
      <div className="monitor-chart-buttons-container">
        <Button
          color={statusType === 'latest' ? 'primary' : null}
          onClick={() => setStatusType('latest')}
        >
          Latest
        </Button>
        <Button
          color={statusType === 'day' ? 'primary' : null}
          onClick={() => setStatusType('day')}
        >
          1 Day
        </Button>
        {showFilters ? (
          <>
            <Button
              color={statusType === 'week' ? 'primary' : null}
              onClick={() => setStatusType('week')}
            >
              1 Week
            </Button>
            <Button
              color={statusType === 'month' ? 'primary' : null}
              onClick={() => setStatusType('month')}
            >
              1 Month
            </Button>
          </>
        ) : null}
      </div>

      <div className="monitor-chart-dropdown-container">
        <Dropdown.Container
          position="left"
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
        >
          <Dropdown.Trigger
            isOpen={dropdownIsOpen}
            toggleDropdown={toggleDropdown}
          >
            <FaEllipsisVertical style={{ width: '25px', height: '25px' }} />
          </Dropdown.Trigger>
          <Dropdown.List isOpen={dropdownIsOpen}>
            <Dropdown.Item
              showDot
              dotColor={'primary'}
              isSelected={statusType === 'latest'}
              onClick={() => setStatusType('latest')}
            >
              Latest
            </Dropdown.Item>
            <Dropdown.Item
              showDot
              dotColor={'primary'}
              isSelected={statusType === 'day'}
              onClick={() => setStatusType('day')}
            >
              1 Day
            </Dropdown.Item>
            <Dropdown.Item
              showDot
              dotColor={'primary'}
              isSelected={statusType === 'week'}
              onClick={() => setStatusType('week')}
            >
              1 Week
            </Dropdown.Item>
            <Dropdown.Item
              showDot
              dotColor={'primary'}
              isSelected={statusType === 'month'}
              onClick={() => setStatusType('month')}
            >
              1 Month
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown.Container>
      </div>
    </>
  );
};

GraphMenu.displayName = 'GraphMenu';

GraphMenu.propTypes = {
  statusType: PropTypes.string.isRequired,
  setStatusType: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
};

export default GraphMenu;
