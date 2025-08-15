import PropTypes from 'prop-types';
import { Textarea } from '@lunalytics/ui';

const MonitorHttpBody = ({ inputs, errors, handleInput }) => {
  const parseBody = (body) => {
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
      <label className="input-label">HTTP Body</label>
      <div className="luna-input-subtitle">
        Add a request body to be sent with the request. Make sure to follow JSON
        key/value format.
      </div>

      <Textarea
        rows={8}
        error={errors.body}
        onChange={(e) => handleInput('body', e.target.value)}
        id="http-body-textarea"
        color="var(--lunaui-accent-900)"
      >
        {parseBody(inputs.body)}
      </Textarea>
    </div>
  );
};

MonitorHttpBody.displayName = 'MonitorHttpBody';

MonitorHttpBody.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
};

export default MonitorHttpBody;
