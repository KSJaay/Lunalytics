import './graph.scss';

// import dependencies
import PropTypes from 'prop-types';
import 'chartjs-adapter-dayjs-3';
import {
  BarController,
  BarElement,
  Chart as ChartJs,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip,
  CategoryScale,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

// import local files
import useLocalStorageContext from '../../../hooks/useLocalstorage';
import GraphMenu from './menu';
import useGraphStatus from '../../../hooks/useGraphStatus';
import { fullMonitorPropType } from '../../../../shared/utils/propTypes';

ChartJs.register(
  LineController,
  BarController,
  LineElement,
  PointElement,
  TimeScale,
  BarElement,
  LinearScale,
  Tooltip,
  Filler,
  CategoryScale
);

const MonitorGraph = ({ monitor, maxValue }) => {
  const { dateformat, timeformat, theme } = useLocalStorageContext();

  const { statusType, statusHeartbeats, setStatusType } =
    useGraphStatus(monitor);

  const labels = statusHeartbeats.map((heartbeat = {}) => heartbeat.date);
  const data = statusHeartbeats.map((heartbeat = {}) => heartbeat.latency);
  const gridColor =
    theme.type === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  return (
    <div className="monitor-chart-container">
      <GraphMenu statusType={statusType} setStatusType={setStatusType} />
      <Chart
        type={'line'}
        data={{
          labels,
          datasets: [
            {
              data,
              borderColor: '#3ba55c',
              backgroundColor: '#3ba55d28',
              yAxisID: 'y',
              fill: 'origin',
              tension: 0.15,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          onResize: (chart) => {
            if (window.innerWidth < 576) {
              chart.canvas.style.height = '225px';
            } else if (window.innerWidth < 768) {
              chart.canvas.style.height = '275px';
            } else if (window.innerWidth < 1200) {
              chart.canvas.style.height = '300px';
            } else if (window.innerWidth < 1920) {
              chart.canvas.style.height = '320px';
            } else {
              chart.canvas.style.height = '400px';
            }
          },
          layout: { padding: { left: 10, right: 30, top: 30, bottom: 10 } },
          elements: { point: { radius: 0, hitRadius: 100 } },
          scales: {
            x: {
              type: 'time',
              time: {
                minUnit: 'minute',
                round: 'second',
                tooltipFormat: `${dateformat} ${timeformat}`,
                displayFormats: { minute: 'HH:mm', hour: 'MM-DD HH:mm' },
              },
              ticks: { maxRotation: 0, autoSkipPadding: 30 },
              grid: { color: gridColor, offset: false },
            },
            y: {
              type: 'linear',
              title: { display: true, text: 'respTime (ms)' },
              offset: true,
              grid: { color: gridColor },
              min: 0,
              max: maxValue,
            },
          },
        }}
      />
    </div>
  );
};

MonitorGraph.displayName = 'MonitorGraph';

MonitorGraph.propTypes = {
  monitor: fullMonitorPropType.isRequired,
  maxValue: PropTypes.number,
};

export default MonitorGraph;
