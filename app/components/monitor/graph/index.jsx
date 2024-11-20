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
} from 'recharts';
import dayjs from 'dayjs';

// import local files
import useLocalStorageContext from '../../../hooks/useLocalstorage';
import GraphMenu from './menu';
import useGraphStatus from '../../../hooks/useGraphStatus';
import { fullMonitorPropType } from '../../../../shared/utils/propTypes';

const MonitorGraph = ({ monitor }) => {
  const { dateformat, timeformat, theme } = useLocalStorageContext();

  const { statusType, statusHeartbeats, setStatusType } =
    useGraphStatus(monitor);

  const data = statusHeartbeats.map((heartbeat = {}) => {
    return { Latency: heartbeat.latency, time: heartbeat.date };
  });

  const gridColor =
    theme.type === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  return (
    <div className="monitor-chart-container">
      <GraphMenu statusType={statusType} setStatusType={setStatusType} />
      <div className="monitor-chart-content">
        <ResponsiveContainer>
          <AreaChart data={data}>
            <XAxis
              type="category"
              dataKey="time"
              style={{ fill: 'var(--accent-200)' }}
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => dayjs(date).format(timeformat)}
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
              labelFormatter={(value) =>
                dayjs(value).format(`${dateformat} - ${timeformat}`)
              }
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
              dataKey="Latency"
              stroke="var(--primary-400)"
              fill="var(--primary-500)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

MonitorGraph.displayName = 'MonitorGraph';

MonitorGraph.propTypes = {
  monitor: fullMonitorPropType.isRequired,
};

export default MonitorGraph;
