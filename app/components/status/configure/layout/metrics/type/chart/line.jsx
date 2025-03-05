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
import PropTypes from 'prop-types';

// import local files
import { defaultHeartbeats } from '../../../../../../../constant/status';
import useLocalStorageContext from '../../../../../../../hooks/useLocalstorage';

const StatusLayoutLineChart = ({ heartbeats = defaultHeartbeats }) => {
  const { theme } = useLocalStorageContext();
  const gridColor =
    theme.type === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  const data = heartbeats
    .map(({ latency = 0, date = 0, time = 0 } = {}) => {
      return { latency, time: date || time };
    })
    .reverse();

  return (
    <ResponsiveContainer style={{ marginLeft: '16px' }}>
      <AreaChart data={data}>
        <XAxis
          type="category"
          dataKey="time"
          style={{ fill: 'var(--accent-200)' }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            return dayjs(value).format('HH:mm');
          }}
          interval={8}
        />
        <YAxis
          style={{ fill: 'var(--accent-200)' }}
          orientation="right"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />
        <CartesianGrid vertical={false} stroke={gridColor} />
        <Tooltip
          formatter={(value) => `${value} ms`}
          labelFormatter={(value) => {
            return dayjs(value).format(`DD/MM/YYYY - HH:mm:ss`);
          }}
          separator=": "
          contentStyle={{
            backgroundColor: 'var(--accent-900)',
            border: '1px solid var(--accent-700)',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '0.8rem',
            color: 'var(--font-color)',
          }}
        />
        <Area
          type="monotone"
          dataKey="latency"
          stroke="var(--status-highlight-color)"
          fill="transparent"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

StatusLayoutLineChart.displayName = 'StatusLayoutLineChart';

StatusLayoutLineChart.propTypes = {
  heartbeats: PropTypes.array.isRequired,
};

export default StatusLayoutLineChart;
