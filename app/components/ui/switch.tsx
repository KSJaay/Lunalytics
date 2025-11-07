import './switch.scss';

// import dependencies
import { Switch } from '@lunalytics/ui';

interface SwitchWithTextProps
  extends Omit<React.ComponentProps<typeof Switch>, 'label'> {
  label: string | React.ReactNode;
  description?: string | React.ReactNode;
  shortDescription?: string | React.ReactNode;
}

const SwitchWithText = ({
  label,
  description,
  shortDescription,
  ...props
}: SwitchWithTextProps) => {
  return (
    <>
      <div className="checkbox-container">
        <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
          <label className="checkbox-input-label">{label}</label>
          {shortDescription && (
            <div className="input-short-description">{shortDescription}</div>
          )}
        </div>
        <Switch {...props} />
      </div>

      {description && <div className="checkbox-description">{description}</div>}
    </>
  );
};

SwitchWithText.displayName = 'SwitchWithText';

export default SwitchWithText;
