// import dependencies
import { Button, Input } from '@lunalytics/ui';
import { customAlphabet } from 'nanoid';

// import local files
import MonitorPageInterval from '../pages/interval';
import MonitorPageNotification from '../pages/notification';
import { useEffect } from 'react';

const nanoid = customAlphabet(
  '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  8
);

interface ModalProps {
  errors: Record<string, string>;
  inputs: Record<string, any>;
  handleInput: (field: string, value: any) => void;
  pageId: string;
  isEdit: boolean;
}

const MonitorConfigurePushModal = ({
  errors,
  inputs,
  handleInput,
  pageId,
  isEdit,
}: ModalProps) => {
  const generateToken = () => {
    const token = nanoid(36);
    handleInput('url', token);
  };

  useEffect(() => {
    console.log('isEdit: ', isEdit);

    if (!isEdit) {
      generateToken();
    }

    return () => {
      if (!isEdit) {
        handleInput('url', '');
      }
    };
  }, []);

  return (
    <>
      {pageId === 'basic' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Input
            id="input-url"
            title="Push Token"
            value={inputs.url}
            subtitle="The token to use for push notifications."
            color="var(--lunaui-accent-900)"
            readOnly
          />

          <Button variant="flat" onClick={generateToken}>
            Regenerate
          </Button>
        </div>
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

      {pageId === 'interval' ? (
        <>
          <MonitorPageInterval
            inputs={inputs}
            errors={errors}
            handleInput={handleInput}
          />
        </>
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

MonitorConfigurePushModal.displayName = 'MonitorConfigurePushModal';

export default MonitorConfigurePushModal;
