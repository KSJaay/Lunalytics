// import dependencies
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

// import local files
import Loading from '../../ui/loading';
import useFetch from '../../../hooks/useFetch';
import { getProviderById } from '../../../../shared/constants/provider';
import useAuthenticationContext from '../../../context/authentication';

const SettingsAuthentication = () => {
  const { config, setConfig } = useAuthenticationContext();

  const { isLoading } = useFetch({
    url: '/api/auth/config',
    onSuccess: (data) => {
      setConfig(data);
    },
    onFailure: () => {
      toast.error("Couldn't fetch authentication configuration");
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      style={{ overflow: 'auto', overflowX: 'hidden' }}
      className="settings-account-container"
      id="manage"
    >
      <div className="sat-header">
        <div style={{ flex: 1 }}>
          <div className="settings-subtitle" style={{ margin: '0px' }}>
            Connections
          </div>
          <div className="sat-subheader">
            Connect your account to various services for easier sign-in.
          </div>
        </div>
      </div>

      <div>
        {config.providers.length < 1 ? (
          <div>No providers available</div>
        ) : (
          config.providers.map((providerId) => {
            const provider = getProviderById(providerId);
            return <div key={provider.id}>{provider.name}</div>;
          })
        )}
      </div>
    </div>
  );
};

export default observer(SettingsAuthentication);
