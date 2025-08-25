// import local files
import MonitorPageTcp from '../pages/tcp';
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';

interface ModalProps {
  errors: Record<string, string>;
  inputs: Record<string, any>;
  handleInput: (field: string, value: any) => void;
  pageId: string;
}

const MonitorConfigureTcpModal = ({
  errors,
  inputs,
  handleInput,
  pageId,
}: ModalProps) => {
  return (
    <>
      {pageId === 'basic' ? (
        <MonitorPageTcp
          inputs={inputs}
          errors={errors}
          handleInput={handleInput}
        />
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

MonitorConfigureTcpModal.displayName = 'MonitorConfigureTcpModal';

export default MonitorConfigureTcpModal;
