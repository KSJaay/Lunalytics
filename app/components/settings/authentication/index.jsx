// import dependencies
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';

// import local files
import Loading from '../../ui/loading';
import SwitchWithText from '../../ui/switch';
import useFetch from '../../../hooks/useFetch';
import SettingsProviderAuthentication from './provider';
import { providers } from '../../../../shared/constants/provider';
import useAuthenticationContext from '../../../context/authentication';
import { createPostRequest } from '../../../services/axios';

const SettingsAuthentication = () => {
  const { setProviders, config, setConfig, setConfigUsingKey } =
    useAuthenticationContext();

  const { isLoading } = useFetch({
    url: '/api/providers',
    onSuccess: (data) => {
      setProviders(data);
    },
    onFailure: () => {
      toast.error("Couldn't fetch authentication providers");
    },
  });

  const { isLoading: isConfigLoading } = useFetch({
    url: '/api/auth/config',
    onSuccess: (data) => {
      setConfig(data);
    },
    onFailure: () => {
      toast.error("Couldn't fetch authentication configuration");
    },
  });

  const handleRegistrationChange = async (e) => {
    await createPostRequest('/api/auth/config/update', {
      register: e.target.checked,
    });

    setConfigUsingKey('register', e.target.checked);
  };

  const handleNativeLoginChange = async (e) => {
    if (!config.sso) {
      return toast.error(
        'You must enable at least one SSO provider to disable native login'
      );
    }

    await createPostRequest('/api/auth/config/update', {
      nativeSignin: e.target.checked,
    });

    setConfigUsingKey('nativeSignin', e.target.checked);
  };

  if (isLoading || isConfigLoading) {
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
            Authentication
          </div>
          <div className="sat-subheader">
            Configure authentication options for Lunalytics.
          </div>
        </div>
      </div>

      <div className="settings-auth-switches">
        <SwitchWithText
          label="Allow Registration"
          name="allowRegistration"
          shortDescription="Allow new users to register for an account"
          checked={config.register}
          onChange={handleRegistrationChange}
        />

        <SwitchWithText
          label="Allow Native Login"
          name="allowNativeLogin"
          shortDescription="Disable internal authentication and only allow SSO login"
          checked={!config.sso ? true : config.nativeSignin}
          onChange={handleNativeLoginChange}
        />
      </div>

      <div>
        <div className="settings-subtitle">OAuth2 Providers</div>
        <div className="settings-auth-providers">
          {providers.map((integration) => (
            <SettingsProviderAuthentication
              key={integration.id}
              integration={integration}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default observer(SettingsAuthentication);
