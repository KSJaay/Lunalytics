import './reorder.scss';

// import dependencies
import { createSwapy } from 'swapy';
import { useEffect, useRef } from 'react';
import { MdHistory } from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import { IoWarning } from 'react-icons/io5';
import { Button, Modal } from '@lunalytics/ui';
import { PiBroadcast, PiDotsSixVerticalBold } from 'react-icons/pi';
import { FaSignal, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { TbLayoutNavbarInactive } from 'react-icons/tb';

const components = {
  header: {
    name: 'Header',
    icon: (size: any) => (
      <TbLayoutNavbarInactive
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    ),
  },
  status: {
    name: 'Status',
    icon: (size: any) => (
      <PiBroadcast style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  incidents: {
    name: 'Incidents',
    icon: (size: any) => (
      <IoWarning style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  uptime: {
    name: 'Uptime',
    icon: (size: any) => (
      <FaSignal style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  metrics: {
    name: 'Metrics',
    icon: (size: any) => (
      <BsGraphUp style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  history: {
    name: 'History',
    icon: (size: any) => (
      <MdHistory style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  customHTML: {
    name: 'Custom HTML',
    icon: (size: any) => (
      <FaHtml5 style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  customCSS: {
    name: 'Custom CSS',
    icon: (size: any) => (
      <FaCss3Alt style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
};

interface StatusConfigureReorderModalProps {
  closeModal: () => void;
  layout: Array<any>;
  reorderBlocks: (newLayout: Array<any>) => void;
}

const StatusConfigureReorderModal = ({
  closeModal,
  layout,
  reorderBlocks,
}: StatusConfigureReorderModalProps) => {
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

  return (
    <Modal
      title="Reorder blocks"
      actions={
        <>
          <Button color="red" variant="flat" onClick={closeModal}>
            Close
          </Button>
          <Button
            color="green"
            variant="flat"
            id="monitor-create-button"
            onClick={() => {
              reorderBlocks(
                swapy.current.slotItemMap().asArray.map((obj: any) => obj.item)
              );
              closeModal();
            }}
          >
            Update
          </Button>
        </>
      }
      onClose={closeModal}
      size="xs"
    >
      <div className="scmr-container" ref={container}>
        {layout.map(
          (block: {
            id: string;
            type:
              | 'header'
              | 'status'
              | 'incidents'
              | 'uptime'
              | 'metrics'
              | 'history'
              | 'customHTML'
              | 'customCSS';
          }) => (
            <div data-swapy-slot={block.id} key={block.id}>
              <div data-swapy-item={block.id} className="scmr-block">
                <div>
                  <PiDotsSixVerticalBold
                    style={{ width: '24px', height: '24px' }}
                  />
                </div>
                <div>{components[block.type].icon(28)}</div>
                <div>{components[block.type].name}</div>
              </div>
            </div>
          )
        )}
      </div>
    </Modal>
  );
};

StatusConfigureReorderModal.displayName = 'StatusConfigureReorderModal';

export default StatusConfigureReorderModal;
