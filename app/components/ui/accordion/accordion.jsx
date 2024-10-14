import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { AccordionContext } from './context';

const Accordion = ({
  children,
  value = [],
  onChange,
  showMultiple = false,
  dark = false,
  ...props
}) => {
  const [selected, setSelected] = useState(value);

  useEffect(() => {
    onChange?.(selected);
  }, [selected, onChange]);

  return (
    <ul className="accordion-list" {...props}>
      <AccordionContext.Provider
        value={{ selected, setSelected, showMultiple, dark }}
      >
        {children}
      </AccordionContext.Provider>
    </ul>
  );
};

Accordion.displayName = 'Accordion';

Accordion.propTypes = {
  children: PropTypes.node,
  value: PropTypes.array,
  onChange: PropTypes.func,
  showMultiple: PropTypes.bool,
  dark: PropTypes.bool,
};

export default Accordion;
