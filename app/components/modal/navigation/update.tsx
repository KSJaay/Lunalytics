// import dependencies
import { Button, Modal } from '@lunalytics/ui';

interface NavigationUpdateModalProps {
  closeModal: () => void;
  version?: string;
}

const NavigationUpdateModal = ({
  closeModal,
  version,
}: NavigationUpdateModalProps) => {
  return (
    <Modal onClose={closeModal} size="sm" height="sm">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          gap: '10px',
        }}
      >
        <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700 }}>
          New Update Available
        </div>

        <div
          style={{
            flex: 1,
            gap: '10px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#44684e',
              borderRadius: '12px',
              padding: '10px 0',
            }}
          >
            <img src="/panda/book.png" style={{ width: '200px' }} />
          </div>
          <div style={{ fontSize: 'var(--font-lg)' }}>
            Looking at the books here and it looks like we&#39;ve been cooking
            up update <span style={{ fontWeight: 600 }}>{version}</span> for
            you! Please have a read through our{' '}
            <a
              href="https://lunalytics.xyz/guides/internals/changelog"
              style={{ color: 'var(--primary-700)' }}
              target="_blank"
              rel="noreferrer"
            >
              documentation
            </a>{' '}
            to find out how to update your application easily.
          </div>
        </div>

        <div
          style={{
            marginTop: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            color="blue"
            variant="flat"
            onClick={() => {}}
            id="notification-create-button"
            as="a"
            href={`https://github.com/KSJaay/Lunalytics/releases/tag/${version}`}
            target="_blank"
            rel="noreferrer"
          >
            What&#39;s new?
          </Button>
        </div>
      </div>
    </Modal>
  );
};

NavigationUpdateModal.displayName = 'NavigationUpdateModal';

export default NavigationUpdateModal;
