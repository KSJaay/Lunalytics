import './colorPicker.scss';

// import dependencies
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';

const ColorPicker = ({
  label,
  id,
  error,
  description,
  isRequired,
  tabIndex = 0,
  color = '#17c964',
  setColor,
  ...props
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOutside =
        containerRef.current && !containerRef.current.contains(event.target);

      if (isClickOutside && showColorPicker) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef, showColorPicker]);

  return (
    <>
      {label && (
        <label className="input-label" id={`color-picker-label-${id}`}>
          {label}
          {isRequired && <span className="input-required">*</span>}
        </label>
      )}
      <div className="color-picker-container">
        <div
          className="color-picker-block"
          style={{ backgroundColor: color }}
          onClick={() => setShowColorPicker(!showColorPicker)}
        />
        <input
          type="text"
          className="color-picker-input"
          id={id}
          value={color}
          tabIndex={tabIndex}
          {...props}
        />
      </div>

      {showColorPicker ? (
        <div className="color-picker-hex" ref={containerRef}>
          <HexColorPicker color={color} onChange={(value) => setColor(value)} />
        </div>
      ) : null}
      {error && (
        <label className="input-error" id={`text-input-error-${id}`}>
          {error}
        </label>
      )}
      {description && <div className="input-description">{description}</div>}
    </>
  );
};

ColorPicker.displayName = 'ColorPicker';

ColorPicker.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  description: PropTypes.string,
  error: PropTypes.string,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  tabIndex: PropTypes.number,
  isRequired: PropTypes.bool,
  color: PropTypes.string,
  setColor: PropTypes.func,
};

export default ColorPicker;
