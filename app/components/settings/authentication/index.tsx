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

  const handleSwitchChange = async (key, value) => {
    try {
      if (!config.sso && key === 'nativeSignin') {
        return toast.error(
          'You must enable at least one SSO provider to disable native login'
        );
      }

      await createPostRequest('/api/auth/config/update', {
        [key]: value,
      });

      setConfigUsingKey(key, value);

      toast.success('Authentication configuration updated successfully');
    } catch (error) {
      if (error?.response?.data?.error) {
        return toast.error(error.response.data.error);
      }

      toast.error("Couldn't update authentication configuration");
    }
  };

  if (isLoading || isConfigLoading) {
    return <Loading />;
  }

  return (
    <div
      style={{ overflowY: 'auto', overflowX: 'hidden' }}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSwitchChange('register', e.target.checked)
          }
        />

        <SwitchWithText
          label="Allow Native Login"
          name="allowNativeLogin"
          shortDescription="Disable internal authentication and only allow SSO login"
          checked={!config.sso ? true : config.nativeSignin}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSwitchChange('nativeSignin', e.target.checked)
          }
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
