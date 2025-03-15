// import local files
import useStatusContext from '../../../../hooks/useConfigureStatus';
import TextInput from '../../../ui/input';

const StatusConfigureAppearanceBranding = () => {
  const {
    settings: { logo, favicon },
    changeValues,
  } = useStatusContext();

  return (
    <div className="scb-container">
      <div>
        <TextInput
          value={logo}
          label="Logo"
          placeholder="/logo.svg"
          onChange={(e) => changeValues({ logo: e.target.value })}
        />
      </div>
      <div>
        <TextInput
          value={favicon}
          label="Favicon"
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
