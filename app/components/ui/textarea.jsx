import './textarea.scss';
import PropTypes from 'prop-types';

const Textarea = ({ label, error, id = 'text-input', children, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {label && <label>{label}</label>}
      <textarea className="textarea" id={id} {...props}>
        {children}
      </textarea>
      {error && (
        <span className="input-error" id={`textarea-error-${props.id}`}>
          {error}
        </span>
      )}
    </div>
  );
};

Textarea.displayName = 'Textarea';

Textarea.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
};

export default Textarea;
