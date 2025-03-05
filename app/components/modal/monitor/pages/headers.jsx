import PropTypes from 'prop-types';
import Textarea from '../../../ui/textarea';

const MonitorHttpHeaders = ({ inputs, errors, handleInput }) => {
  const parseHeaders = (body) => {
    try {
      if (typeof body === 'object') {
        return JSON.stringify(body, null, 2);
      }
    } catch (_error) {
      return '';
    }
  };

  return (
    <>
      <label className="input-label">HTTP Headers</label>
      <div style={{ padding: '0 0 8px 4px' }}>
        Add additional headers to be sent with the request. Make sure to follow
        JSON key/value format.
      </div>

      <Textarea
        rows={8}
        error={errors.headers}
        onChange={(e) => handleInput('headers', e.target.value)}
        id="http-headers-textarea"
      >
        {parseHeaders(inputs.headers)}
      </Textarea>
    </>
  );
};

MonitorHttpHeaders.displayName = 'MonitorHttpHeaders';

MonitorHttpHeaders.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorHttpHeaders;
