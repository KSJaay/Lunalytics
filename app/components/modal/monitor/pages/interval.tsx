// import dependencies
import { Input } from '@lunalytics/ui';

const MonitorAddInterval = ({ inputs, errors, handleInput }) => {
  return (
    <div className="monitor-configure-container">
      <Input
        id="input-interval"
        type="number"
        title="Interval"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput('interval', e.target.value);
        }}
        value={inputs.interval}
        error={errors.interval}
        color="var(--lunaui-accent-900)"
        subtitle="Time in seconds between each monitor check."
      />

      <Input
        id="input-retry"
        type="number"
        title="Retry"
        subtitle="Max number of retries before sending a notification for service down."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput('retry', e.target.value);
        }}
        value={inputs.retry}
        error={errors.retry}
        color="var(--lunaui-accent-900)"
      />

      <Input
        id="input-retry-interval"
        type="number"
        title="Retry Interval"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput('retryInterval', e.target.value);
        }}
        value={inputs.retryInterval}
        error={errors.retryInterval}
        color="var(--lunaui-accent-900)"
        subtitle="Time in seconds between each retry attempt once previous attempt fails."
      />

      <Input
        id="input-request-timeout"
        type="number"
        title="Request Timeout"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          handleInput('requestTimeout', e.target.value);
        }}
        value={inputs.requestTimeout}
        error={errors.requestTimeout}
        color="var(--lunaui-accent-900)"
        subtitle="Time in seconds before the request times out."
      />
    </div>
  );
};

MonitorAddInterval.displayName = 'MonitorAddInterval';

export default MonitorAddInterval;
