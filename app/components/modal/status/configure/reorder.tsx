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
    icon: (size) => (
      <TbLayoutNavbarInactive
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    ),
  },
  status: {
    name: 'Status',
    icon: (size) => (
      <PiBroadcast style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  incidents: {
    name: 'Incidents',
    icon: (size) => (
      <IoWarning style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  uptime: {
    name: 'Uptime',
    icon: (size) => (
      <FaSignal style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  metrics: {
    name: 'Metrics',
    icon: (size) => (
      <BsGraphUp style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  history: {
    name: 'History',
    icon: (size) => (
      <MdHistory style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  customHTML: {
    name: 'Custom HTML',
    icon: (size) => (
      <FaHtml5 style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
  customCSS: {
    name: 'Custom CSS',
    icon: (size) => (
      <FaCss3Alt style={{ width: `${size}px`, height: `${size}px` }} />
    ),
  },
};

const StatusConfigureReorderModal = ({ closeModal, layout, reorderBlocks }) => {
  const swapy = useRef(null);
  const container = useRef(null);

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
                swapy.current.slotItemMap().asArray.map((obj) => obj.item)
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
        {layout.map((block) => (
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
        ))}
      </div>
    </Modal>
  );
};

StatusConfigureReorderModal.displayName = 'StatusConfigureReorderModal';

export default StatusConfigureReorderModal;
