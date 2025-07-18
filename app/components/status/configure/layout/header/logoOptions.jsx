// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import Switch from '../../../../ui/switch';
import Tabs from '../../../../ui/tabs';
import {
  statusAlignments,
  statusRotations,
  statusSizes,
} from '../../../../../../shared/constants/status';
import useStatusPageContext from '../../../../../context/status-page';

const StatusConfigureLayoutHeaderLogoOptions = ({ componentId }) => {
  const { getComponent, setComponentValue } = useStatusPageContext();

  const { title = {} } = getComponent(componentId);

  return (
    <div style={{ flex: 1 }}>
      <div className="sclh-options-title">Title & Logo</div>
      <div className="sclh-options-list">
        <Switch
          label="Show logo"
          shortDescription="Whether or not the logo should be shown"
          checked={title.showLogo}
          onChange={(e) => {
            setComponentValue(componentId, 'title', {
              showLogo: e.target.checked,
            });
          }}
        />
        <Switch
          label="Show title"
          shortDescription="Whether or not the title should be shown"
          checked={title.showTitle}
          onChange={(e) => {
            setComponentValue(componentId, 'title', {
              showTitle: e.target.checked,
            });
          }}
        />
        <Tabs
          label="Logo Size"
          options={statusSizes}
          activeOption={title.logoSize}
          onChange={(e) => {
            setComponentValue(componentId, 'title', { logoSize: e });
          }}
        />
        <Tabs
          label="Title Size"
          options={statusSizes}
          activeOption={title.titleSize}
          onChange={(e) => {
            setComponentValue(componentId, 'title', { titleSize: e });
          }}
        />
        <Tabs
          label="Rotation"
          options={statusRotations}
          activeOption={title.rotation}
          onChange={(e) => {
            setComponentValue(componentId, 'title', { rotation: e });
          }}
        />
        <Tabs
          label="Alignment"
          options={statusAlignments}
          activeOption={title.alignment}
          onChange={(e) => {
            setComponentValue(componentId, 'title', { alignment: e });
          }}
        />
      </div>
    </div>
  );
};

StatusConfigureLayoutHeaderLogoOptions.displayName =
  'StatusConfigureLayoutHeaderLogoOptions';

StatusConfigureLayoutHeaderLogoOptions.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default observer(StatusConfigureLayoutHeaderLogoOptions);
