import classNames from 'classnames';

interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  id: string;
  description?: string;
  shortDescription?: string;
  options?: Array<string | { value: string; color: string }>;
  activeOption?: string;
  tabIndex?: number;
  onChange?: (value: string | { value: string; color: string }) => void;
  color?: string;
  error?: string;
}

const Tabs = ({
  label,
  id,
  description,
  shortDescription,
  options = [],
  activeOption,
  tabIndex = 0,
  onChange,
  color,
  error,
  ...props
}: TabsProps) => {
  const colorName = color ? `var(--${color}-700)` : 'var(--accent-700)';

  return (
    <div>
      {label && <label className="input-label">{label}</label>}
      {shortDescription && (
        <div className="input-short-description">{shortDescription}</div>
      )}
      <div className="input-theme-container">
        {options.map((item: string | { value: string; color: string }) => {
          if (typeof item === 'object') {
            const classes = classNames('input-theme-item', {
              [item.color]: item.color,
            });

            return (
              <div
                id={id}
                key={item.value}
                tabIndex={tabIndex}
                className={classes}
                style={{
                  backgroundColor: activeOption === item.value ? colorName : '',
                }}
                onClick={() => onChange?.(item.value)}
                {...props}
              >
                {item.value}
              </div>
            );
          }

          return (
            <div
              id={id}
              key={item}
              tabIndex={tabIndex}
              className="input-theme-item"
              style={{
                backgroundColor: activeOption === item ? colorName : '',
              }}
              onClick={() => onChange?.(item)}
              {...props}
            >
              {item}
            </div>
          );
        })}
      </div>

      {error && (
        <label className="input-error" id={`text-input-error-${id}`}>
          {error}
        </label>
      )}
      {description && <div className="input-description">{description}</div>}
    </div>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
