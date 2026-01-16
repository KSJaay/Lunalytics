import { RxUpdate } from 'react-icons/rx';
import NavigationUpdateModal from '../../modal/navigation/update';
import useConfigContext from '../../../context/config';

const LeftUpdateButton = ({ closeModal, openModal }: any) => {
  const { version } = useConfigContext();

  if (version.hasLoaded === false || !version.updateAvailable) return null;

  return (
    <div
      className="navigation-left-action update"
      onClick={() =>
        openModal(
          <NavigationUpdateModal
            closeModal={closeModal}
            version={version.latest}
          />
        )
      }
    >
      <RxUpdate size={28} />
    </div>
  );
};

export default LeftUpdateButton;
