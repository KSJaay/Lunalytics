import { Dropdown } from '@lunalytics/ui';
import { FaEllipsisVertical, FaSort } from 'react-icons/fa6';
import NavigationReorderModal from '../modal/navigation/reorder';
import useContextStore from '../../context';
import { observer } from 'mobx-react-lite';

const HomeMenu = () => {
  const {
    modalStore: { openModal, closeModal },
  } = useContextStore();

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
