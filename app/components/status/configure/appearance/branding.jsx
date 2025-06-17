import { Input } from '@lunalytics/ui';

// import local files
import useStatusContext from '../../../../hooks/useConfigureStatus';

const StatusConfigureAppearanceBranding = () => {
  const {
    settings: { logo, favicon },
    changeValues,
  } = useStatusContext();

  return (
    <div className="scb-container">
      <div>
        <Input
          value={logo}
          title="Logo"
          placeholder="/logo.svg"
          onChange={(e) => changeValues({ logo: e.target.value })}
        />
      </div>
      <div>
        <Input
          value={favicon}
          title="Favicon"
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

export default StatusConfigureAppearanceBranding;
