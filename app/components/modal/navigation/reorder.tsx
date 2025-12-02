// import dependencies
import { createSwapy } from 'swapy';
import { toast } from 'react-toastify';
import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from '@lunalytics/ui';
import { PiDotsSixVerticalBold } from 'react-icons/pi';

// import local files
import useContextStore from '../../../context';
import { createPostRequest } from '../../../services/axios';

interface NavigationReorderModalProps {
  closeModal: () => void;
}

export const getMonitorsInOrder = (
  allMonitors: Array<any>,
  monitorsList: Array<{
    type: 'monitor' | 'folder';
    isHidden: boolean;
    monitorId: string;
  }>
) => {
  let userMonitors = monitorsList || [];

  allMonitors.forEach((monitor) => {
    if (!userMonitors.find((m) => m.monitorId === monitor.monitorId)) {
      userMonitors.push({
        type: 'monitor',
        isHidden: false,
        monitorId: monitor.monitorId,
      });
    }
  });

  return userMonitors;
};

const NavigationReorderModal = ({
  closeModal,
}: NavigationReorderModalProps) => {
  const {
    globalStore: { allMonitors },
    userStore: { user, updateUsingKey },
  } = useContextStore();

  const swapy = useRef<any>(null);
  const container = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (container.current) {
      swapy.current = createSwapy(container.current);
    }

    return () => {
      swapy.current?.destroy();
    };
  }, []);

  const monitorOrder = getMonitorsInOrder(
    allMonitors,
    user?.settings?.monitorsList
  );

  const handleConfirm = async () => {
    const order = swapy.current
      .slotItemMap()
      .asArray.map((obj: any) =>
        monitorOrder.find((m: any) => m.monitorId === obj.item)
      )
      .filter(Boolean);

    await createPostRequest('/api/user/update/settings', {
      settings: {
        ...user?.settings,
        monitorsList: order,
      },
    });

    updateUsingKey('settings', {
      ...user.settings,
      monitorsList: order,
    });

    toast.success('Monitor order updated successfully');
    closeModal();
  };

  return (
    <Modal
      onClose={closeModal}
      size="sm"
      height="sm"
      title="Reorder Monitors"
      actions={
        <>
          <Button
            color="red"
            variant="flat"
            id="home-reorder-cancel-button"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            color="green"
            variant="flat"
            id="home-reorder-confirm-button"
            onClick={handleConfirm}
          >
            Confirm
          </Button>
        </>
      }
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        ref={container}
      >
        {monitorOrder.map((item) => {
          const monitor = allMonitors.find(
            (m) => m.monitorId === item.monitorId
          );

          if (!monitor) return null;

          return (
            <div data-swapy-slot={item.monitorId} key={item.monitorId}>
              <div
                style={{
                  display: 'flex',
                  border: '2px solid var(--accent-700)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--accent-800)',
                }}
                data-swapy-item={item.monitorId}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    fontSize: 'var(--font-lg)',
                  }}
                >
                  <img
                    src={monitor.icon.url}
                    alt={monitor.name}
                    style={{ width: '24px', height: '24px' }}
                  />
                  <div>{monitor.name}</div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {/* {monitorOrder.find((m) => m.monitorId === item.monitorId)
                    ?.isHidden ? (
                    <IoMdEyeOff size={24} />
                  ) : (
                    <IoMdEye size={24} />
                  )} */}
                  <PiDotsSixVerticalBold
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

NavigationReorderModal.displayName = 'NavigationReorderModal';

export default observer(NavigationReorderModal);
