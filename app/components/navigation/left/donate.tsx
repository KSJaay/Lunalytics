import { BiSolidDonateHeart } from 'react-icons/bi';
import NavigationDonateModal from '../../modal/navigation/donate';
// import useConfigContext from '../../../context/config';

const LeftDonateButton = ({ closeModal, openModal }: any) => {
  // const {} = useConfigContext();

  return (
    <div
      className="navigation-left-action donate"
      onClick={() =>
        openModal(<NavigationDonateModal closeModal={closeModal} />)
      }
    >
      <BiSolidDonateHeart size={28} />
    </div>
  );
};

export default LeftDonateButton;
