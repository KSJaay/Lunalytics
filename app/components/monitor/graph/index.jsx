import './graph.scss';

// import dependencies
import dayjs from 'dayjs';
import CanvasJSReact from '@canvasjs/react-charts';

// import local files
import GraphMenu from './menu';
import useGraphStatus from '../../../hooks/useGraphStatus';
import useLocalStorageContext from '../../../hooks/useLocalstorage';
import { fullMonitorPropType } from '../../../../shared/utils/propTypes';

const { CanvasJSChart } = CanvasJSReact;

const MonitorGraph = ({ monitor }) => {
  const {
    dateformat,
    theme,
    timeformat,
    timezone: timeZone,
  } = useLocalStorageContext();
  const { statusType, statusHeartbeats, setStatusType } =
    useGraphStatus(monitor);

  const data = statusHeartbeats.map((heartbeat = {}) => {
    const date = new Date(
      new Date(heartbeat.date).toLocaleString('en-US', { timeZone })
    );
    return {
      x: date,
      y: heartbeat.latency,
      toolTipContent: `<div style='"display: flex; flex-direction: column; gap: 5px;"'>   
        <div>${dayjs(date).format(`${dateformat} ${timeformat}`)}</div>
        <div>${heartbeat.latency}ms</div>
        </div>`,
      color: heartbeat.isDown ? '#b80a47' : '#13a452',
    };
  });

  const options = {
    theme: theme.type === 'light' ? 'light2' : 'dark2',
    animationEnabled: true,
    zoomEnabled: true,
    backgroundColor: 'transparent',
    toolTip: {
      enabled: true,
      animationEnabled: true,
    },
    axisX: {
      lineColor: '#505b62',
      tickColor: '#505b62',
      tickLength: 5,
    },
    axisY: {
      title: 'respTime (ms)',
      titleFontSize: 18,
      gridColor: '#505b62',
      lineColor: '#505b62',
      tickColor: '#505b62',
      minimum: 0,
    },
    data: [
      {
        type: 'splineArea',
        lineThickness: 2,
        // Render colors of chart based on user theme
        color: '#10894466',
        lineColor: '#13a452',
        markerType: 'circle',
        markerSize: 0,
        xValueFormatString: 'MMM YYYY',
        dataPoints: data,
      },
    ],
  };

  return (
    <div className="monitor-chart-container">
      <GraphMenu statusType={statusType} setStatusType={setStatusType} />
      <div style={{ padding: '10px 20px 20px 20px' }}>
        <CanvasJSChart options={options} />
      </div>
    </div>
  );
};

MonitorGraph.displayName = 'MonitorGraph';

MonitorGraph.propTypes = {
  monitor: fullMonitorPropType.isRequired,
};

export default MonitorGraph;
