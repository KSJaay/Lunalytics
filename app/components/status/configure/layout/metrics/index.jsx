import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { Input } from '@lunalytics/ui';
import { observer } from 'mobx-react-lite';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

// import local files
import Tabs from '../../../../ui/tabs';
import Switch from '../../../../ui/switch';
import { FaTrashCan } from '../../../../icons';
import StatusConfigureMonitor from '../../monitor';
import useContextStore from '../../../../../context';
import StatusConfigureLayoutMetricsOptions from './options';
import StatusConfigureLayoutMetricsDropdown from './dropdown';
import useStatusPageContext from '../../../../../context/status-page';
import { statusGraphTypes } from '../../../../../../shared/constants/status';

const defaultMonitorObject = { graphType: 'Basic', showPing: true };

const getGraphWithType = (type, monitors, componentId) => {
  if (type === 'Separate') {
    return monitors.map((monitor) => (
      <StatusConfigureLayoutMetricsOptions
        key={monitor.id}
        monitorId={monitor.id}
        componentId={componentId}
      />
    ));
  }

  if (type === 'Dropdown') {
    const { id, title } = monitors[0] || {};

    if (!id) return null;

    return (
      <StatusConfigureLayoutMetricsDropdown
        componentId={componentId}
        title={title}
      />
    );
  }

  return null;
};

const StatusConfigureLayoutMetrics = ({ componentId }) => {
  const {
    globalStore: { allMonitors, getMonitor },
  } = useContextStore();
  const { setComponentValue, getComponent, removeComponent } =
    useStatusPageContext();

  const {
    monitors,
    graphType,
    isMinimized,
    autoAdd,
    data: { showName, showPing } = {},
    title,
  } = getComponent(componentId);

  const updateAutoAdd = (value) => {
    setComponentValue(componentId, 'autoAdd', value);
  };

  const addSelectedMonitor = (monitorId) => {
    const { name = '' } = getMonitor(monitorId) || {};
    setComponentValue(componentId, 'monitors', [
      ...monitors,
      { id: monitorId, title: name, ...defaultMonitorObject },
    ]);
  };

  const addAllMonitors = () => {
    setComponentValue(
      componentId,
      'monitors',
      allMonitors.map((monitor) => {
        const { name = '' } = getMonitor(monitor.monitorId) || {};
        return { id: monitor.monitorId, title: name, ...defaultMonitorObject };
      })
    );
  };

  const removeMonitor = (monitorId) => {
    setComponentValue(
      componentId,
      'monitors',
      monitors.filter((monitor) => monitor.id !== monitorId)
    );
  };

  return (
    <>
      <div className="scc-block">
        <div className="scc-title">Uptime Metrics</div>

        <div className="scl-menu">
          <div
            className="scl-minimize"
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

          <div className="scl-bin" onClick={() => removeComponent(componentId)}>
            <FaTrashCan style={{ width: '20px', height: '20px' }} />
          </div>
        </div>
        <div className="sclh-content" style={{ flexDirection: 'column' }}>
          {monitors.length > 0 && !autoAdd
            ? getGraphWithType(graphType, monitors, componentId)
            : null}
        </div>

        {!isMinimized && (
          <>
            <StatusConfigureMonitor
              componentId={componentId}
              getValues={() => {
                const monitorIds = monitors.map((montior) => montior.id);

                return { autoAdd, monitors: monitorIds };
              }}
              updateAutoAdd={updateAutoAdd}
              addSelectedMonitor={addSelectedMonitor}
              addAllMonitors={addAllMonitors}
              removeMonitor={removeMonitor}
            />

            {autoAdd || graphType === 'Dropdown' ? (
              <>
                <Switch
                  label={'Show name'}
                  shortDescription={
                    'This will show the monitor name for the graph'
                  }
                  checked={showName}
                  onChange={(e) =>
                    setComponentValue(componentId, 'data', {
                      showName: e.target.checked,
                    })
                  }
                />
                <Switch
                  label={'Show ping'}
                  shortDescription={
                    'This will show the current ping for the monitor'
                  }
                  checked={showPing}
                  onChange={(e) =>
                    setComponentValue(componentId, 'data', {
                      showPing: e.target.checked,
                    })
                  }
                />
              </>
            ) : null}

            <Input
              title="Title"
              value={title}
              placeholder="Monitors"
              onChange={(e) =>
                setComponentValue(componentId, 'title', e.target.value)
              }
            />

            <Tabs
              label="Graph type"
              options={statusGraphTypes}
              shortDescription="Change the layout for the metrics graph"
              activeOption={graphType}
              onChange={(value) =>
                setComponentValue(componentId, 'graphType', value)
              }
            />
          </>
        )}
      </div>
    </>
  );
};

StatusConfigureLayoutMetrics.displayName = 'StatusConfigureLayoutMetrics';

StatusConfigureLayoutMetrics.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default observer(StatusConfigureLayoutMetrics);
