// import dependencies
import { useTranslation } from 'react-i18next';

// import local files
import Dropdown from '../../../ui/dropdown';
import useDropdown from '../../../../hooks/useDropdown';
import type { NotificationProps } from '../../../../types/notifications';

interface NotificationModalTypeProps {
  messageType: 'basic' | 'pretty' | 'nerdy';
  setMessageType: (type: {
    key: keyof NotificationProps;
    value: string;
  }) => void;
}

const NotificationModalType = ({
  messageType = 'basic',
  setMessageType,
}: NotificationModalTypeProps) => {
  const { dropdownIsOpen, toggleDropdown } = useDropdown();
  const { t } = useTranslation();

  return (
    <>
      <label className="input-label">{t('notification.message_type')}</label>
      <Dropdown.Container
        position="right"
        isOpen={dropdownIsOpen}
        toggleDropdown={toggleDropdown}
        id="home-menu-layout"
      >
        <Dropdown.Trigger
          isOpen={dropdownIsOpen}
          toggleDropdown={toggleDropdown}
          asInput
        >
          {messageType.charAt(0).toUpperCase() + messageType.slice(1)}
        </Dropdown.Trigger>
        <Dropdown.List isOpen={dropdownIsOpen} fullWidth>
          {['basic', 'pretty', 'nerdy'].map((type) => (
            <Dropdown.Item
              key={type}
              onClick={() => {
                setMessageType({
                  key: 'messageType',
                  value: type,
                });
                toggleDropdown();
              }}
            >
              {t(`notification.${type}`)}
            </Dropdown.Item>
          ))}
        </Dropdown.List>
      </Dropdown.Container>
    </>
  );
};

NotificationModalType.displayName = 'NotificationModalType';

export default NotificationModalType;
