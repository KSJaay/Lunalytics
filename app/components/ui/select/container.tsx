// import dependencies
import classNames from 'classnames';
import { useEffect, useRef } from 'react';

interface SelectContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'left' | 'right' | 'center' | 'top';
  isOpen: boolean;
  toggleSelect: () => void;
  children: React.ReactNode;
}

const Container = ({
  position = 'left',
  isOpen,
  toggleSelect,
  children,
  ...props
}: SelectContainerProps) => {
  const classes = classNames('select', {
    'select-position--right': position === 'right',
    'select-position--left': position === 'left',
    'select-position--center': position === 'center',
    'select-position--top': position === 'top',
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOutside =
        containerRef.current &&
        !containerRef.current.contains(event.target as Node);

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

export default Container;
