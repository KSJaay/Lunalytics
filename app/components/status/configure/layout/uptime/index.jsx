// import dependencies
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

// import local files
import { FaTrashCan } from '../../../../icons';
import TextInput from '../../../../ui/input';
import Tabs from '../../../../ui/tabs';
import {
  StatusUptimeBasicGraph,
  StatusUptimeNerdyGraph,
  StatusUptimePrettyGraph,
} from './graph';
import useStatusContext from '../../../../../hooks/useConfigureStatus';
import StatusConfigureMonitor from '../../monitor';
import useContextStore from '../../../../../context';
import { statusGraphDesigns, statusIndicators } from '../../../../../../shared/constants/status';

const StatusConfigureLayoutUptime = ({ componentId }) => {
  const {
    globalStore: { getMonitor, allMonitors },
  } = useContextStore();

  const { getComponent, setComponentValue, removeComponent } =
    useStatusContext();

  const component = getComponent(componentId);
  const { title, monitors, graphType, status, statusIndicator, isMinimized } =
    component;

  const graphClass = classNames({
    'status-uptime-basic-graph-container': graphType === 'Basic',
    'status-uptime-pretty-graph-container': graphType === 'Pretty',
    'status-uptime-nerdy-graph-container': graphType === 'Nerdy',
  });

  const updateAutoAdd = (value) => {
    setComponentValue(componentId, 'autoAdd', value);
    if (value) {
      addAllMonitors();
    } else {
      setComponentValue(componentId, 'monitors', []);
    }
  };

  const addSelectedMonitor = (monitorId) => {
    setComponentValue(componentId, 'monitors', [...monitors, monitorId]);
  };

  const addAllMonitors = () => {
    setComponentValue(
      componentId,
      'monitors',
      allMonitors.map((monitor) => monitor.monitorId)
    );
  };

  const removeMonitor = (monitorId) => {
    setComponentValue(
      componentId,
      'monitors',
      monitors.filter((id) => id !== monitorId)
    );
  };

  const graphTitle = useMemo(() => title?.trim(), [title]);

  return (
    <>
      <div className="status-configure-content-block">
        <div className="status-configure-content-title">Uptime graph</div>

        <div className="status-configure-layout-menu">
          <div
            className="status-configure-layout-minimize"
            onClick={() =>
              setComponentValue(componentId, 'isMinimized', !isMinimized)
            }
          >
            {isMinimized ? (
              <FiMaximize style={{ width: '20px', height: '20px' }} />
            ) : (
              <FiMinimize style={{ width: '20px', height: '20px' }} />
            )}
          </div>

          <div
            className="status-configure-layout-bin"
            onClick={() => removeComponent(componentId)}
          >
            <FaTrashCan style={{ width: '20px', height: '20px' }} />
          </div>
        </div>

        <div className={graphClass}>
          {graphTitle && (
            <div
              style={{
                fontSize: 'var(--font-2xl)',
                fontWeight: '700',
                paddingLeft: '4px',
              }}
            >
              {graphTitle}
            </div>
          )}
          <div>
            {monitors.length === 0 && (
              <StatusUptimeBasicGraph indicator={statusIndicator} />
            )}

            {monitors.length > 0 &&
              monitors.map((monitorId) => {
                const monitor = getMonitor(monitorId);

                if (graphType === 'Pretty') {
                  return (
                    <StatusUptimePrettyGraph
                      key={monitorId}
                      monitor={{ ...monitor, status }}
                      indicator={statusIndicator}
                    />
                  );
                }

                if (graphType === 'Nerdy') {
                  return (
                    <StatusUptimeNerdyGraph
                      key={monitorId}
                      monitor={{ ...monitor, status }}
                      indicator={statusIndicator}
                    />
                  );
                }

                return (
                  <StatusUptimeBasicGraph
                    key={monitorId}
                    monitor={{ ...monitor, status }}
                    indicator={statusIndicator}
                  />
                );
              })}
          </div>
        </div>

        {!isMinimized && (
          <StatusConfigureMonitor
            componentId={componentId}
            getValues={getComponent}
            updateAutoAdd={updateAutoAdd}
            addSelectedMonitor={addSelectedMonitor}
            addAllMonitors={addAllMonitors}
            removeMonitor={removeMonitor}
          />
        )}

        {!isMinimized && (
          <div className="status-configure-layout-header-content">
            <div style={{ flex: 1 }}>
              <TextInput
                label="Title"
                placeholder="Monitors"
                shortDescription="This can be left blank if you don't want a title"
                value={title}
                onChange={(e) =>
                  setComponentValue(componentId, 'title', e.target.value)
                }
              />
              <Tabs
                label="Incident color"
                options={['Operational', 'Maintenance', 'Incident', 'Outage']}
                activeOption={status}
                onChange={(value) =>
                  setComponentValue(componentId, 'status', value)
                }
                shortDescription="This is for testing only and will not be saved"
              />
              <Tabs
                label="Graph type"
                options={statusGraphDesigns}
                activeOption={graphType}
                onChange={(value) =>
                  setComponentValue(componentId, 'graphType', value)
                }
              />
              <Tabs
                label="Status indicator"
                options={statusIndicators}
                activeOption={statusIndicator}
                onChange={(value) =>
                  setComponentValue(componentId, 'statusIndicator', value)
                }
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

StatusConfigureLayoutUptime.displayName = 'StatusConfigureLayoutUptime';

StatusConfigureLayoutUptime.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default observer(StatusConfigureLayoutUptime);
