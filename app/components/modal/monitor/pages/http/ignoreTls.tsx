// import dependencies
import SwitchWithText from '../../../../ui/switch';

const MonitorHttpIgnoreTls = ({
  handleChange,
  checkboxValue = false,
}: {
  handleChange: (key: string, value: any) => void;
  checkboxValue?: boolean;
}) => {
  return (
    <div style={{ padding: '1rem 0' }}>
      <SwitchWithText
        label="Ignore TLS"
        shortDescription="Ignore TLS certificate validation for the monitor."
        checked={checkboxValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange('ignoreTls', e.target.checked)
        }
      />
    </div>
  );
};

MonitorHttpIgnoreTls.displayName = 'MonitorHttpIgnoreTls';

export default MonitorHttpIgnoreTls;
