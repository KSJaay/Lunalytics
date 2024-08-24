import './textarea.scss';
import PropTypes from 'prop-types';

const Textarea = ({ label, error, children, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <label>{label}</label>}
      <textarea className="textarea" {...props}>
        {children}
      </textarea>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  children: PropTypes.node,
};

export default Textarea;
