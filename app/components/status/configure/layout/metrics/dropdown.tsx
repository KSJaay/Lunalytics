// import dependencies
import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';

// import local files
import StatusConfigureLayoutMetricsTypeBasic from './type/basic';
import useStatusPageContext from '../../../../../context/status-page';

const StatusConfigureLayoutMetricsDropdown = ({ componentId, title }) => {
  const { getComponent, layoutItems } = useStatusPageContext();

  const { data: { showName, showPing } = {} } = useMemo(
    () => getComponent(componentId),
    [componentId, JSON.stringify(layoutItems)]
  );

  return (
    <>
      <div className="sclg-title">Graph options</div>
      <div className="sclg-container">
        <StatusConfigureLayoutMetricsTypeBasic
          showPing={showPing}
          showTitle={showName ? title : false}
        />
      </div>
    </>
  );
};

StatusConfigureLayoutMetricsDropdown.displayName =
  'StatusConfigureLayoutMetricsDropdown';

export default observer(StatusConfigureLayoutMetricsDropdown);
