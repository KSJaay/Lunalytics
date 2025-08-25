// import dependencies
import { Input } from '@lunalytics/ui';

// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';
import MonitorHttpHeaders from '../pages/headers';
import MonitorHttpBody from '../pages/body';
import MonitorHttpIgnoreTls from '../pages/http/ignoreTls';
import MonitorHttpMethods from '../pages/http/methods';
import MonitorJsonQueryCheck from '../pages/json/check';

interface ModalProps {
  errors: Record<string, string>;
  inputs: Record<string, any>;
  handleInput: (field: string, value: any) => void;
  pageId: string;
}

const MonitorConfigureJsonQueryModal = ({
  errors,
  inputs,
  handleInput,
  pageId,
}: ModalProps) => {
  return (
    <>
      {pageId === 'basic' ? (
        <>
          <Input
            id="input-url"
            title={'URL'}
            value={inputs.url}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleInput('url', event.target.value);
            }}
            error={errors.url}
            subtitle="The URL to monitor. Must start with http:// or https://"
            color="var(--lunaui-accent-900)"
          />

          <MonitorHttpMethods
            selectValue={inputs.method}
            handleSelect={(method: string) => handleInput('method', method)}
          />

          <MonitorJsonQueryCheck
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        </>
      ) : null}

      {pageId === 'interval' ? (
        <>
          <MonitorPageInterval
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        </>
      ) : null}

      {pageId === 'notification' ? (
        <>
          <MonitorPageNotification
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        </>
      ) : null}

      {pageId === 'advanced' ? (
        <>
          <MonitorHttpIgnoreTls
            handleChange={handleInput}
            checkboxValue={inputs.ignoreTls}
          />

          <MonitorHttpHeaders
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />

          <MonitorHttpBody
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        </>
      ) : null}
    </>
  );
};

MonitorConfigureJsonQueryModal.displayName = 'MonitorConfigureJsonQueryModal';

export default MonitorConfigureJsonQueryModal;
