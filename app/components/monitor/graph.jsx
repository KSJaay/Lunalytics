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

const MonitorGraph = ({ maxValue }) => {
  return (
    <div className="monitor-chart-container">
      <Chart
        type={'line'}
        data={{
          labels: [
            dayjs('2022-01-01').valueOf(),
            dayjs('2022-01-02').valueOf(),
            dayjs('2022-01-03').valueOf(),
            dayjs('2022-01-04').valueOf(),
            dayjs('2022-01-05').valueOf(),
            dayjs('2022-01-06').valueOf(),
            dayjs('2022-01-07').valueOf(),
            dayjs('2022-01-08').valueOf(),
            dayjs('2022-01-09').valueOf(),
            dayjs('2022-01-10').valueOf(),
            dayjs('2022-01-11').valueOf(),
            dayjs('2022-01-12').valueOf(),
            dayjs('2022-01-13').valueOf(),
            dayjs('2022-01-14').valueOf(),
            dayjs('2022-01-14').valueOf(),
            dayjs('2022-01-15').valueOf(),
            dayjs('2022-01-16').valueOf(),
            dayjs('2022-01-17').valueOf(),
            dayjs('2022-01-18').valueOf(),
            dayjs('2022-01-19').valueOf(),
            dayjs('2022-01-20').valueOf(),
            dayjs('2022-01-21').valueOf(),
            dayjs('2022-01-22').valueOf(),
            dayjs('2022-01-23').valueOf(),
            dayjs('2022-01-24').valueOf(),
            dayjs('2022-01-25').valueOf(),
            dayjs('2022-01-26').valueOf(),
            dayjs('2022-01-27').valueOf(),
            dayjs('2022-01-28').valueOf(),
            dayjs('2022-02-01').valueOf(),
            dayjs('2022-02-02').valueOf(),
            dayjs('2022-02-03').valueOf(),
            dayjs('2022-02-04').valueOf(),
            dayjs('2022-02-05').valueOf(),
            dayjs('2022-02-06').valueOf(),
          ],
          datasets: [
            {
              data: [
                65, 59, 80, 81, 26, 55, 40, 65, 59, 80, 81, 26, 55, 40, 65, 59,
                80, 81, 26, 55, 40, 65, 59, 80, 81, 26, 55, 40, 65, 59, 80, 81,
                26, 55, 40,
              ],
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
                minUnit: 'minute',
                round: 'second',
                tooltipFormat: 'YYYY-MM-DD HH:mm:ss',
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
