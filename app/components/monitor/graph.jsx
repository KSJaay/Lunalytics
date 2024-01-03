import './graph.scss';
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

import 'chartjs-adapter-dayjs-3';
import dayjs from 'dayjs';

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

const MonitorGraph = ({ heartbeats, maxValue }) => {
  const labels = heartbeats.map((heartbeat) => heartbeat.date);
  const data = heartbeats.map((heartbeat) => heartbeat.latency);

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
            if (window.screen.width < 576) {
              chart.canvas.parentNode.style.height = '275px';
            } else if (window.screen.width < 768) {
              chart.canvas.parentNode.style.height = '320px';
            } else if (window.screen.width < 992) {
              chart.canvas.parentNode.style.height = '300px';
            } else {
              chart.canvas.parentNode.style.height = '250px';
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
                minUnit: 'second',
                round: 'second',
                tooltipFormat: 'YYYY-MM-DD HH:mm:ss',
                displayFormats: {
                  minute: 'HH:mm:ss',
                  hour: 'MM-DD HH:mm:ss',
                },
              },
              ticks: {
                maxRotation: 0,
                autoSkipPadding: 30,
              },
              grid: {
                color:
                  'dark' === 'light'
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
                  'dark' === 'light'
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

export default MonitorGraph;
