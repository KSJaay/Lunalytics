// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

const Container = ({
  position = 'left',
  isOpen,
  toggleSelect,
  children,
  ...props
}) => {
  const classes = classNames('select', {
    'select-position--right': position === 'right',
    'select-position--left': position === 'left',
    'select-position--center': position === 'center',
    'select-position--top': position === 'top',
  });

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOutside =
        containerRef.current && !containerRef.current.contains(event.target);

      if (isClickOutside && isOpen) {
        toggleSelect();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef, isOpen, toggleSelect]);

  return (
    <div className={classes} ref={containerRef} {...props}>
      {children}
    </div>
  );
};

Container.displayName = 'Select.Container';

Container.propTypes = {
  children: PropTypes.node,
  position: PropTypes.oneOf(['left', 'right', 'center', 'top']),
  isOpen: PropTypes.bool.isRequired,
  toggleSelect: PropTypes.func.isRequired,
};

export default Container;
