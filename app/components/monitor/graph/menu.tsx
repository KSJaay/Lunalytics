// import dependencies
import { Button } from '@lunalytics/ui';
import { useTranslation } from 'react-i18next';

// import local files
import Dropdown from '../../ui/dropdown';
import useDropdown from '../../../hooks/useDropdown';
import { FaEllipsisVertical } from '../../icons';

interface GraphMenuProps {
  statusType: string;
  setStatusType: (status: 'latest' | 'day' | 'week' | 'month') => void;
  showFilters: boolean;
}

const GraphMenu = ({
  statusType,
  setStatusType,
  showFilters,
}: GraphMenuProps) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();
  const { t } = useTranslation();

  return (
    <>
      <div className="monitor-chart-buttons-container">
        <Button
          color={statusType === 'latest' ? 'primary' : 'gray'}
          onClick={() => setStatusType('latest')}
        >
          {t('home.monitor.graph.latest')}
        </Button>
        <Button
          color={statusType === 'day' ? 'primary' : 'gray'}
          onClick={() => setStatusType('day')}
        >
          1 {t('common.day')}
        </Button>
        {showFilters ? (
          <>
            <Button
              color={statusType === 'week' ? 'primary' : 'gray'}
              onClick={() => setStatusType('week')}
            >
              1 {t('common.week')}
            </Button>
            <Button
              color={statusType === 'month' ? 'primary' : 'gray'}
              onClick={() => setStatusType('month')}
            >
              1 {t('common.month')}
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
              {t('home.monitor.graph.latest')}
            </Dropdown.Item>
            <Dropdown.Item
              showDot
              dotColor={'primary'}
              isSelected={statusType === 'day'}
              onClick={() => setStatusType('day')}
            >
              1 {t('common.day')}
            </Dropdown.Item>
            <Dropdown.Item
              showDot
              dotColor={'primary'}
              isSelected={statusType === 'week'}
              onClick={() => setStatusType('week')}
            >
              1 {t('common.week')}
            </Dropdown.Item>
            <Dropdown.Item
              showDot
              dotColor={'primary'}
              isSelected={statusType === 'month'}
              onClick={() => setStatusType('month')}
            >
              1 {t('common.month')}
            </Dropdown.Item>
          </Dropdown.List>
        </Dropdown.Container>
      </div>
    </>
  );
};

GraphMenu.displayName = 'GraphMenu';

export default GraphMenu;
