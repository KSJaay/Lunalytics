import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useContext, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa6';
import { AccordionContext } from './context';

const AccordionItem = ({ children, value, title, tag, subtitle, ...props }) => {
  const { selected, setSelected, showMultiple, dark } =
    useContext(AccordionContext);
  const open = selected.includes(value);

  const ref = useRef(null);
  const classes = classNames('accordion-list-item', {
    'accordion-list-item-dark': dark,
  });

  return (
    <li {...props} className={classes}>
      <header
        role="button"
        onClick={() => {
          if (showMultiple) {
            setSelected(
              open
                ? selected.filter((item) => item !== value)
                : [...selected, value]
            );
          } else {
            setSelected(open ? [] : [value]);
          }
        }}
      >
        <div style={{ flex: 1 }}>
          <div className="accordion-list-item-title">{title}</div>
          {subtitle && (
            <div
              style={{ fontWeight: 'normal', color: 'var(--font-light-color)' }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {tag && <div className="accordion-list-item-tag">{tag}</div>}
        <FaChevronDown
          size={16}
          style={{
            transition: 'transform 0.3s ease-in-out',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </header>
      <div
        style={{
          height: open ? ref.current?.offsetHeight : 0,
          overflowY: 'hidden',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <div style={{ padding: '0.1rem 0' }} ref={ref}>
          {children}
        </div>
      </div>
    </li>
  );
};

AccordionItem.displayName = 'AccordionItem';

AccordionItem.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  title: PropTypes.string,
  tag: PropTypes.string,
  subtitle: PropTypes.string,
};

export default AccordionItem;
