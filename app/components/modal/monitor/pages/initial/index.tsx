// import dependencies
import { Input } from '@lunalytics/ui';

// import local files
import MonitorInitialDropdown from './type';
import MonitorIconSelect from './icons';
import MonitorParentSelect from './parent';

interface MonitorInitialTypeProps {
  inputs: any;
  errors: any;
  handleInput: (key: string, value: any) => void;
  isEdit: boolean;
}

const MonitorInitialType = ({
  inputs,
  errors,
  handleInput,
  isEdit,
}: MonitorInitialTypeProps) => {
  return (
    <div className="monitor-configure-container">
      <Input
        title="Name"
        id="input-name"
        value={inputs.name || ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleInput('name', e.target.value)
        }
        error={errors.name}
        color="var(--lunaui-accent-900)"
        subtitle="Friendly name used to identify the monitor"
      />

      {!isEdit && (
        <MonitorInitialDropdown
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
        />
      )}

      {isEdit && (
        <Input
          title="Monitor Type"
          value={inputs.type?.toUpperCase()}
          readOnly
          color="var(--lunaui-accent-900)"
          subtitle="Monitor type cannot be changed after creation"
        />
      )}

      <MonitorIconSelect inputs={inputs} handleInput={handleInput} />

      <MonitorParentSelect inputs={inputs} handleInput={handleInput} />
    </div>
  );
};

MonitorInitialType.displayName = 'MonitorInitialType';

export default MonitorInitialType;
