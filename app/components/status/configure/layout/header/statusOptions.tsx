// import dependencies
import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';

// import local files
import Switch from '../../../../ui/switch';
import Tabs from '../../../../ui/tabs';
import {
  statusAlignments,
  statusSizes,
} from '../../../../../../shared/constants/status';
import useStatusPageContext from '../../../../../context/status-page';

const StatusConfigureLayoutHeaderStatusOptions = ({ componentId }) => {
  const { setComponentValue, getComponent, layoutItems } =
    useStatusPageContext();

  const { status = {} } = useMemo(
    () => getComponent(componentId),
    [componentId, JSON.stringify(layoutItems)]
  );

  return (
    <div style={{ flex: 1 }}>
      <div className="sclh-options-title">Service Status</div>
      <div className="sclh-options-list">
        <Switch
          label="Show title"
          shortDescription="Whether or not the title should be shown"
          checked={status.showTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setComponentValue(componentId, 'status', {
              showTitle: e.target.checked,
            });
          }}
        />
        <Switch
          label="Show service status"
          shortDescription="Whether or not the service status should be shown"
          checked={status.showStatus}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setComponentValue(componentId, 'status', {
              showStatus: e.target.checked,
            });
          }}
        />
        <Tabs
          label="Title Size"
          options={statusSizes}
          activeOption={status.titleSize}
          onChange={(e: string) => {
            setComponentValue(componentId, 'status', { titleSize: e });
          }}
        />
        <Tabs
          label="Status Size"
          options={statusSizes}
          activeOption={status.statusSize}
          onChange={(e: string) => {
            setComponentValue(componentId, 'status', { statusSize: e });
          }}
        />

        <Tabs
          label="Alignment"
          options={statusAlignments}
          activeOption={status.alignment}
          onChange={(e: string) => {
            setComponentValue(componentId, 'status', { alignment: e });
          }}
        />
      </div>
    </div>
  );
};

StatusConfigureLayoutHeaderStatusOptions.displayName =
  'StatusConfigureLayoutHeaderStatusOptions';

export default observer(StatusConfigureLayoutHeaderStatusOptions);
