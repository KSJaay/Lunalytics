// import dependencies
import { observer } from 'mobx-react-lite';
import { Button, Switch } from '@lunalytics/ui';

// import local files
import useContextStore from '../../../context';
import useAuthenticationContext from '../../../context/authentication';
import SettingsAuthenticationConfigureModal from '../../modal/settings/authentication/configure';

const SettingsProviderAuthentication = ({ integration }) => {
  const {
    modalStore: { openModal, closeModal },
  } = useContextStore();

  const { getProvider, pauseProvider } = useAuthenticationContext();

  const provider = getProvider(integration.id);

  return (
    <div className="settings-auth-provider" key={integration.id}>
      <div style={{ padding: '12px' }}>
        <img
          src={integration.icon}
          style={{
            backgroundColor:
              integration.name === 'GitHub' ? 'var(--white)' : null,
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
          onChange={() => pauseProvider(!provider?.enabled)}
          checked={provider?.enabled}
          disabled={!provider}
        />
      </div>
    </div>
  );
};

export default observer(SettingsProviderAuthentication);
