// import dependencies
import { useState } from 'react';
import { Tooltip } from '@lunalytics/ui';
import { MdEdit } from 'react-icons/md';
import { IoCopy } from 'react-icons/io5';
import { observer } from 'mobx-react-lite';
import { FaTrashCan } from 'react-icons/fa6';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';

// import local files
import useContextStore from '../../../context';
import useClipboard from '../../../hooks/useClipboard';
import SettingsApiCloseModal from '../../modal/settings/api/delete';
import SettingsApiConfigureModal from '../../modal/settings/api/createOrEdit';

const ManageApiToken = ({ tokenId, tokenName, tokenPermissions }) => {
  const {
    modalStore: { openModal, closeModal },
  } = useContextStore();
  const [isHidden, setIsHidden] = useState(true);
  const clipboard = useClipboard();

  const copyTokenToClipboard = async () => {
    await clipboard(tokenId, 'Token copied to clipboard!');
  };

  return (
    <div className="sat-container">
      <div className="sat-title-container">
        <div className="title">{tokenName}</div>
        <div className="subtitle">
          {isHidden ? '• • • • • • • • • • • • • • • • • • • • •' : tokenId}
        </div>
      </div>
      <div></div>
      <div className="sat-buttons">
        <Tooltip
          text={isHidden ? 'Show Token' : 'Hide Token'}
          onClick={() => setIsHidden(!isHidden)}
        >
          <div className="button">
            {isHidden ? <IoMdEye size={18} /> : <IoMdEyeOff size={18} />}
          </div>
        </Tooltip>
        <Tooltip text="Copy Token">
          <div className="button" onClick={copyTokenToClipboard}>
            <IoCopy size={18} />
          </div>
        </Tooltip>
        <Tooltip text="Edit Token">
          <div
            className="button"
            onClick={() =>
              openModal(
                <SettingsApiConfigureModal
                  closeModal={closeModal}
                  tokenId={tokenId}
                  tokenName={tokenName}
                  tokenPermissions={tokenPermissions}
                  isEdit
                />
              )
            }
          >
            <MdEdit size={18} />
          </div>
        </Tooltip>
        <Tooltip text="Delete Token">
          <div
            className="button"
            onClick={() =>
              openModal(
                <SettingsApiCloseModal
                  tokenId={tokenId}
                  tokenName={tokenName}
                />
              )
            }
          >
            <FaTrashCan size={18} />
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

ManageApiToken.displayName = 'ManageApiToken';

export default observer(ManageApiToken);
