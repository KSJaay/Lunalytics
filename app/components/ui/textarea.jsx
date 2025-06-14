import './textarea.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Textarea = ({
  label,
  error,
  id = 'text-input',
  disableResize = false,
  shortDescription,
  children,
  ...props
}) => {
  const classnames = classNames('textarea', {
    'textarea-resize': disableResize,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {label && <label className="input-label">{label}</label>}
      {shortDescription && (
        <div className="input-short-description">{shortDescription}</div>
      )}
      <textarea className={classnames} id={id} {...props}>
        {children}
      </textarea>
      {error && (
        <span className="input-error" id={`textarea-error-${id}`}>
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
