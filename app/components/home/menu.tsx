import { Dropdown } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { FaEllipsisVertical, FaSort } from 'react-icons/fa6';
import useModalContext from '../../context/modal';
import NavigationReorderModal from '../modal/navigation/reorder';

const HomeMenu = () => {
  const { openModal, closeModal } = useModalContext();

  return (
    <Dropdown
      items={[
        {
          id: 'customize-dashboard',
          text: 'Reorder Monitors',
          type: 'item',
          icon: (<FaSort />) as React.ReactNode,
          onClick: () => {
            openModal(<NavigationReorderModal closeModal={closeModal} />);
          },
        },
      ]}
      hideIcon
      position="top"
    >
      <FaEllipsisVertical size={20} />
    </Dropdown>
  );
};

export default observer(HomeMenu);
