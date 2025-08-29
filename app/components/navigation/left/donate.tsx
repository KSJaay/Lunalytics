import { BiSolidDonateHeart } from 'react-icons/bi';
import useFetch from '../../../hooks/useFetch';
import NavigationDonateModal from '../../modal/navigation/donate';

const LeftDonateButton = ({ closeModal, openModal }: any) => {
  const { isLoading, isError, data } = useFetch({
    url: '/api/version',
  });

  if (isLoading || isError || data?.updateAvailable) return null;

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
