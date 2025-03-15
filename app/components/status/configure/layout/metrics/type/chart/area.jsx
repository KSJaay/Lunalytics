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
// import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
import PropTypes from 'prop-types';

// import local files
import { defaultHeartbeats } from '../../../../../../../constant/status';

const StatusLayoutAreaChart = ({ heartbeats = defaultHeartbeats }) => {
  const gridColor = 'rgba(255,255,255,0.1)';

  return (
    <ResponsiveContainer style={{ marginLeft: '-16px' }}>
      <AreaChart data={heartbeats}>
        <XAxis
          type="category"
          dataKey="time"
          style={{ fill: 'var(--accent-200)' }}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            return dayjs(value).format('HH:mm');
          }}
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
            return dayjs(value).format(`DM/MM/YYYY - HH:mm:ss`);
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
          dataKey="Latency"
          stroke="var(--primary-400)"
          fill="var(--primary-500)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

StatusLayoutAreaChart.displayName = 'StatusLayoutAreaChart';

StatusLayoutAreaChart.propTypes = {
  heartbeats: PropTypes.array.isRequired,
};

export default StatusLayoutAreaChart;
