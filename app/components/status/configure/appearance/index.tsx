import './styles.scss';

import { observer } from 'mobx-react-lite';

// import local files
import Tabs from '../../../ui/tabs';
import StatusConfigureAppearanceFont from './fonts';
import StatusConfigureAppearanceColors from './color';
import StatusConfigureAppearanceBranding from './branding';
import useStatusPageContext from '../../../../context/status-page';

const StatusConfigureAppearance = () => {
  const {
    settings: { theme = 'Auto' },
    changeValues,
  } = useStatusPageContext();

  return (
    <div className="scc-block">
      <div>
        <div className="scc-title">Status Page Appearance</div>
        <div className="scc-description">
          Select the theme and colors to use for the status page.
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

export default observer(StatusConfigureAppearance);
