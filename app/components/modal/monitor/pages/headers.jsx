import PropTypes from 'prop-types';
import { Textarea } from '@lunalytics/ui';

const MonitorHttpHeaders = ({ inputs, errors, handleInput }) => {
  const parseHeaders = (body) => {
    try {
      if (typeof body === 'object') {
        return JSON.stringify(body, null, 2);
      }
    } catch {
      return '';
    }
  };

  return (
    <div className="luna-input-wrapper">
      <label className="input-label">HTTP Headers</label>
      <div className="luna-input-subtitle">
        Add additional headers to be sent with the request. Make sure to follow
        JSON key/value format.
      </div>

      <Textarea
        rows={8}
        error={errors.headers}
        onChange={(e) => handleInput('headers', e.target.value)}
        id="http-headers-textarea"
        color="var(--lunaui-accent-900)"
      >
        {parseHeaders(inputs.headers)}
      </Textarea>
    </div>
  );
};

MonitorHttpHeaders.displayName = 'MonitorHttpHeaders';

MonitorHttpHeaders.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorHttpHeaders;
