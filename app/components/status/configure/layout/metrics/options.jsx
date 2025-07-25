// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';

// import local files
import Tabs from '../../../../ui/tabs';
import Switch from '../../../../ui/switch';
import StatusConfigureLayoutMetricsTypeBasic from './type/basic';
import StatusConfigureLayoutMetricsTypeNerdy from './type/nerdy';
import StatusConfigureLayoutMetricsTypePretty from './type/pretty';
import useStatusPageContext from '../../../../../context/status-page';

const getGraphType = (graphType, title, showPing) => {
  if (graphType === 'Basic') {
    return (
      <StatusConfigureLayoutMetricsTypeBasic
        showPing={showPing}
        showTitle={title}
      />
    );
  }

  if (graphType === 'Pretty') {
    return (
      <StatusConfigureLayoutMetricsTypePretty
        showPing={showPing}
        showTitle={title}
      />
    );
  }

  if (graphType === 'Nerdy') {
    return (
      <StatusConfigureLayoutMetricsTypeNerdy
        showPing={showPing}
        showTitle={title}
      />
    );
  }

  return null;
};

const StatusConfigureLayoutMetricsOptions = ({ componentId, monitorId }) => {
  const { getComponentMonitor, setMonitorValue } = useStatusPageContext;
  const {
    graphType,
    title = '',
    showPing = true,
  } = getComponentMonitor(componentId, monitorId);

  return (
    <>
      <div className="sclg-title">Graph options</div>
      <div className="sclg-container">
        {getGraphType(graphType, title, showPing)}

        <div className="sclg-options-container">
          <div className="sclg-options-content">
            <Input
              title="Graph title"
              placeholder="Monitors"
              shortDescription="This can be left blank if you don't want a title"
              value={title}
              onChange={(e) =>
                setMonitorValue(componentId, monitorId, 'title', e.target.value)
              }
            />
          </div>
          <div className="sclg-options-content">
            <Tabs
              options={['Basic', 'Pretty', 'Nerdy']}
              label="Graph type"
              activeOption={graphType}
              onChange={(value) =>
                setMonitorValue(componentId, monitorId, 'graphType', value)
              }
            />

            <Switch
              title="Show Ping"
              shortDescription="Show the last latency of the monitor on the graph"
              checked={showPing}
              onChange={(e) => {
                setMonitorValue(
                  componentId,
                  monitorId,
                  'showPing',
                  e.target.checked
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

StatusConfigureLayoutMetricsOptions.displayName =
  'StatusConfigureLayoutMetricsOptions';

StatusConfigureLayoutMetricsOptions.propTypes = {
  componentId: PropTypes.string.isRequired,
  monitorId: PropTypes.string.isRequired,
};

export default observer(StatusConfigureLayoutMetricsOptions);
