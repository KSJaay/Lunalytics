// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

const Container = ({
  position = 'left',
  isOpen,
  toggleDropdown,
  children,
  className = '',
  ...props
}) => {
  const classes = classNames('dropdown', {
    'dropdown-position--right': position === 'right',
    'dropdown-position--left': position === 'left',
    'dropdown-position--center': position === 'center',
    'dropdown-position--top': position === 'top',
  });

  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOutside =
        containerRef.current && !containerRef.current.contains(event.target);

      if (isClickOutside && isOpen) {
        toggleDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef, isOpen, toggleDropdown]);

  return (
    <div className={`${classes} ${className}`} ref={containerRef} {...props}>
      {children}
    </div>
  );
};

Container.displayName = 'Dropdown.Container';

Container.propTypes = {
  children: PropTypes.node,
  position: PropTypes.oneOf(['left', 'right', 'center', 'top']),
  isOpen: PropTypes.bool.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Container;
