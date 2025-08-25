// import dependencies
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

interface DropdownContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'left' | 'right' | 'center' | 'top';
  isOpen: boolean;
  toggleDropdown: () => void;
  children: React.ReactNode;
  className?: string;
}

const Container = ({
  position = 'left',
  isOpen,
  toggleDropdown,
  children,
  className = '',
  ...props
}: DropdownContainerProps) => {
  const classes = classNames('dropdown', {
    'dropdown-position--right': position === 'right',
    'dropdown-position--left': position === 'left',
    'dropdown-position--center': position === 'center',
    'dropdown-position--top': position === 'top',
  });

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOutside =
        containerRef.current &&
        !containerRef.current.contains(event.target as Node);

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

export default Container;
