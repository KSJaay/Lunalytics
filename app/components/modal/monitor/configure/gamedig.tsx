// import dependencies
import { Input } from '@lunalytics/ui';

// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';
import MonitorGameDigOptions from '../pages/gamedig/games';

interface ModalProps {
  errors: Record<string, string>;
  inputs: Record<string, any>;
  handleInput: (field: string, value: any) => void;
  pageId: string;
}

const MonitorConfigureGamedigModal = ({
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
            title={'Hostname'}
            value={inputs.url}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleInput('url', event.target.value);
            }}
            error={errors.url}
            color="var(--lunaui-accent-900)"
            subtitle="Hostname or IP address to resolve via DNS."
          />

          <MonitorGameDigOptions
            error={errors.game}
            selectValue={inputs.game}
            handleSelect={(game: string, port: number) => {
              handleInput('game', game);
              handleInput('port', port);
            }}
          />

          <Input
            id="input-port"
            title="Port"
            value={inputs.port}
            error={errors.port}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInput('port', e.target.value)
            }
            color="var(--lunaui-accent-900)"
            subtitle="DNS server port (53 used as default)."
          />
        </>
      ) : null}

      {pageId === 'interval' ? (
        <MonitorPageInterval
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
        />
      ) : null}

      {pageId === 'notification' ? (
        <MonitorPageNotification
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
        />
      ) : null}

      {pageId === 'advanced' ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--font-xl)',
            color: 'var(--font-light-color)',
            fontWeight: 500,
          }}
        >
          Nothing to see here, maybe there will be more stuff here in the future
        </div>
      ) : null}
    </>
  );
};

MonitorConfigureGamedigModal.displayName = 'MonitorConfigureGamedigModal';

export default MonitorConfigureGamedigModal;
