import { Input } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';

// import local files
import useStatusPageContext from '../../../../context/status-page';

const StatusConfigureAppearanceBranding = () => {
  const {
    settings: { logo, favicon },
    changeValues,
  } = useStatusPageContext;

  return (
    <div className="scb-container">
      <div>
        <Input
          title="Logo"
          value={logo || ''}
          placeholder="/logo.svg"
          onChange={(e) => changeValues({ logo: e.target.value })}
        />
      </div>
      <div>
        <Input
          title="Favicon"
          value={favicon || ''}
          placeholder="/logo.svg"
          onChange={(e) => changeValues({ favicon: e.target.value })}
        />
      </div>
    </div>
  );
};

StatusConfigureAppearanceBranding.displayName =
  'StatusConfigureAppearanceBranding';

StatusConfigureAppearanceBranding.propTypes = {};

export default observer(StatusConfigureAppearanceBranding);
