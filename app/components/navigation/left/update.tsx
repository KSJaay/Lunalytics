import { RxUpdate } from 'react-icons/rx';
import useFetch from '../../../hooks/useFetch';
import NavigationUpdateModal from '../../modal/navigation/update';

const LeftUpdateButton = ({ closeModal, openModal }: any) => {
  const { isLoading, isError, data } = useFetch({
    url: '/api/version',
  });

  if (isLoading || isError || !data?.updateAvailable) return null;

  return (
    <div
      className="navigation-left-action update"
      onClick={() =>
        openModal(
          <NavigationUpdateModal
            closeModal={closeModal}
            version={data?.latest}
          />
        )
      }
    >
      <RxUpdate size={28} />
    </div>
  );
};

export default LeftUpdateButton;
