// import dependencies
import { observer } from 'mobx-react-lite';
import { Button, Switch } from '@lunalytics/ui';

// import local files
import useAuthenticationContext from '../../../context/authentication';
import SettingsAuthenticationConfigureModal from '../../modal/settings/authentication/configure';
import useModalContext from '../../../context/modal';

const SettingsProviderAuthentication = ({ integration }) => {
  const { openModal, closeModal } = useModalContext();

  const { getProvider, pauseProvider } = useAuthenticationContext();

  const provider = getProvider(integration.id);

  return (
    <div className="settings-auth-provider" key={integration.id}>
      <div style={{ padding: '12px' }}>
        <img
          src={integration.icon}
          style={{
            backgroundColor:
              integration.name === 'GitHub' ? 'var(--white)' : undefined,
          }}
          className="settings-auth-provider-img"
        />
      </div>
      <div className="settings-auth-provider-title">{integration.name}</div>
      <div className="settings-auth-provider-description">
        {integration.description}
      </div>
      <div className="settings-auth-provider-config">
        <Button
          variant="flat"
          onClick={() =>
            openModal(
              <SettingsAuthenticationConfigureModal
                provider={provider}
                integration={integration}
                closeModal={closeModal}
              />
            )
          }
        >
          Configure
        </Button>
        <Switch
          onChange={() => {
            if (!provider) return;
            pauseProvider(provider?.provider, !provider?.enabled);
          }}
          checked={provider?.enabled}
          disabled={!provider}
        />
      </div>
    </div>
  );
};

export default observer(SettingsProviderAuthentication);
