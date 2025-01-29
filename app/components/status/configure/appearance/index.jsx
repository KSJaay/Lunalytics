import './styles.scss';

// import local files
import StatusConfigureAppearanceColors from './color';
import StatusConfigureAppearanceBranding from './branding';
import StatusConfigureAppearanceFont from './fonts';
import Tabs from '../../../ui/tabs';
import useStatusContext from '../../../../hooks/useConfigureStatus';

const StatusConfigureAppearance = () => {
  const {
    settings: { theme = 'Auto' },
    changeValues,
  } = useStatusContext();

  return (
    <div className="status-configure-content-block">
      <div>
        <div className="status-configure-content-title">
          Monitors for Status page
        </div>
        <div className="status-configure-content-description">
          Select monitors to display on the status page.
        </div>
      </div>

      <StatusConfigureAppearanceColors />
      <StatusConfigureAppearanceFont />
      <StatusConfigureAppearanceBranding />

      <Tabs
        label="Theme:"
        options={['Auto', 'Light', 'Dark']}
        onChange={(value) => changeValues({ theme: value })}
        activeOption={theme}
      />
    </div>
  );
};

StatusConfigureAppearance.displayName = 'StatusConfigureAppearance';

StatusConfigureAppearance.propTypes = {};

export default StatusConfigureAppearance;
