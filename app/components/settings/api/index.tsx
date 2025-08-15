import './style.scss';

// import dependencies
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { Button } from '@lunalytics/ui';
import { IoKey } from 'react-icons/io5';

// import local files
import useTokensContext from '../../../context/tokens';
import SettingsApiCreateModal from '../../modal/settings/api/createOrEdit';
import ManageApiToken from './token';
import useContextStore from '../../../context';
import useFetch from '../../../hooks/useFetch';

const ManageApiTokens = () => {
  const { allTokens, setTokens } = useTokensContext();
  const {
    modalStore: { openModal, closeModal },
  } = useContextStore();

  useFetch({
    url: '/api/tokens',
    onSuccess: (data) => {
      setTokens(data?.tokens || []);
    },
    onFailure: () => toast.error("Couldn't fetch api tokens"),
  });

  return (
    <div
      style={{ overflowY: 'auto', overflowX: 'hidden' }}
      className="settings-account-container"
      id="manage"
    >
      <div className="sat-header">
        <div style={{ flex: 1 }}>
          <div className="settings-subtitle" style={{ margin: '0px' }}>
            API Tokens
          </div>
          <div className="sat-subheader">
            API tokens can be used to authenticate your requests to Lunalytics.
          </div>
        </div>
        <div className="sat-create-btn">
          <Button
            variant="flat"
            color="primary"
            onClick={() =>
              openModal(<SettingsApiCreateModal closeModal={closeModal} />)
            }
          >
            Create Token
          </Button>
        </div>
      </div>

      {!allTokens?.length ? (
        <div className="notification-empty">
          <div className="notification-empty-icon">
            <IoKey style={{ width: '64px', height: '64px' }} />
          </div>
          <div className="notification-empty-text">No tokens found</div>
        </div>
      ) : null}

      {allTokens?.length
        ? allTokens.map((token) => (
            <ManageApiToken
              key={token.token}
              tokenId={token.token}
              tokenName={token.name}
              tokenPermissions={token.permission}
            />
          ))
        : null}
    </div>
  );
};

ManageApiTokens.displayName = 'ManageApiTokens';

export default observer(ManageApiTokens);
