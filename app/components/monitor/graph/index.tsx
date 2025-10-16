import './graph.scss';

// import dependencies
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import dayjs from 'dayjs';
import { toJS } from 'mobx';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// import local files
import useLocalStorageContext from '../../../hooks/useLocalstorage';
import GraphMenu from './menu';
import useGraphStatus from '../../../hooks/useGraphStatus';
import GraphPing from './ping';
import type { MonitorProps } from '../../../types/monitor';

dayjs.extend(timezone);
dayjs.extend(utc);

const MonitorGraph = ({ monitor }: { monitor: MonitorProps }) => {
  const { theme, timezone } = useLocalStorageContext();

  const { statusType, statusHeartbeats, setStatusType } =
    useGraphStatus(monitor);

  const data = [...toJS(statusHeartbeats)]?.reverse();

  const gridColor =
    theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  return (
    <div className="monitor-chart-container">
      <GraphMenu
        statusType={statusType}
        setStatusType={setStatusType}
        showFilters={monitor.showFilters}
      />
      <div className="monitor-chart-content">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--primary-800)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--primary-900)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <XAxis
              type="category"
              dataKey="date"
              style={{ fill: 'var(--accent-200)' }}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                return dayjs(value).tz(timezone).format('HH:mm');
              }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              label={{
                value: 'respTime (ms)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
              style={{ fill: 'var(--accent-200)' }}
            />
            <CartesianGrid vertical={false} stroke={gridColor} />
            <Tooltip
              formatter={(value) => `${value} ms`}
              labelFormatter={(value) => {
                return dayjs(value)
                  .tz(timezone)
                  .format(`DD MMM YYYY - HH:mm:ss`);
              }}
              separator=": "
              contentStyle={{
                backgroundColor: 'var(--accent-800)',
                border: '1px solid var(--accent-600)',
                padding: '10px',
                borderRadius: '5px',
                fontSize: '0.8rem',
                color: 'var(--font-color)',
              }}
            />
            <Area
              type="monotone"
              dataKey="latency"
              strokeWidth={3}
              stroke="var(--primary-800)"
              fill="url(#colorPrimary)"
            />

            {data
              .filter((item) => item.isDown)
              .map((item, index) => (
                <ReferenceDot
                  key={index}
                  x={item.date}
                  y={item.latency}
                  r={2}
                  fill="var(--red-700)"
                  stroke="var(--red-700)"
                  strokeWidth={2}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <GraphPing data={data} />
    </div>
  );
};

MonitorGraph.displayName = 'MonitorGraph';

export default MonitorGraph;
