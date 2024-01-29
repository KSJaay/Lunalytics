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
import useTime from '../../hooks/useTime';
import useTheme from '../../hooks/useTheme';
import { heartbeatPropType } from '../../utils/propTypes';

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

const MonitorGraph = ({ heartbeats = [], maxValue }) => {
  const { dateformat, timeformat } = useTime();

  const labels = heartbeats.map((heartbeat) => heartbeat.date);
  const data = heartbeats.map((heartbeat) => heartbeat.latency);
  const { theme } = useTheme();

  return (
    <div className="monitor-chart-container">
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
            chart.canvas.parentNode.style.position = 'relative';

            if (window.innerWidth < 576) {
              chart.canvas.parentNode.style.height = '225px';
              chart.canvas.style.height = '225px';
            } else if (window.innerWidth < 768) {
              chart.canvas.parentNode.style.height = '275px';
              chart.canvas.style.height = '275px';
            } else if (window.innerWidth < 1200) {
              chart.canvas.parentNode.style.height = '300px';
              chart.canvas.style.height = '300px';
            } else if (window.innerWidth < 1920) {
              chart.canvas.parentNode.style.height = '320px';
              chart.canvas.style.height = '320px';
            } else {
              chart.canvas.parentNode.style.height = '400px';
              chart.canvas.style.height = '400px';
            }
          },
          layout: {
            padding: {
              left: 10,
              right: 30,
              top: 30,
              bottom: 10,
            },
          },
          elements: {
            point: {
              radius: 0,
              hitRadius: 100,
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                minUnit: 'minute',
                round: 'second',
                tooltipFormat: `${dateformat} ${timeformat}`,
                displayFormats: {
                  minute: 'HH:mm',
                  hour: 'MM-DD HH:mm',
                },
              },
              ticks: {
                maxRotation: 0,
                autoSkipPadding: 30,
              },
              grid: {
                color:
                  theme.type === 'light'
                    ? 'rgba(0,0,0,0.1)'
                    : 'rgba(255,255,255,0.1)',
                offset: false,
              },
            },
            y: {
              type: 'linear',
              title: {
                display: true,
                text: 'respTime (ms)',
              },
              offset: true,
              grid: {
                color:
                  theme.type === 'light'
                    ? 'rgba(0,0,0,0.1)'
                    : 'rgba(255,255,255,0.1)',
              },
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
  heartbeats: PropTypes.arrayOf(heartbeatPropType).isRequired,
  maxValue: PropTypes.number.isRequired,
};

export default MonitorGraph;
