import './reorder.scss';

// import dependencies
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { MdHistory } from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import { IoWarning } from 'react-icons/io5';
import { PiBroadcast, PiDotsSixVerticalBold } from 'react-icons/pi';
import { FaSignal, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { TbLayoutNavbarInactive } from 'react-icons/tb';

// import local files
import Modal from '../../../ui/modal';
import { createSwapy } from 'swapy';

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
    <Modal.Container closeButton={closeModal}>
      <Modal.Title style={{ textAlign: 'center', fontSize: 'var(--font-xl)' }}>
        Reorder blocks
      </Modal.Title>
      <Modal.Message>
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
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button onClick={closeModal}>Close</Modal.Button>
        <Modal.Button
          color="green"
          id="monitor-create-button"
          onClick={() => {
            reorderBlocks(
              swapy.current.slotItemMap().asArray.map((obj) => obj.item)
            );
            closeModal();
          }}
        >
          Update
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

StatusConfigureReorderModal.displayName = 'StatusConfigureReorderModal';

StatusConfigureReorderModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  layout: PropTypes.array.isRequired,
  reorderBlocks: PropTypes.func.isRequired,
};

export default StatusConfigureReorderModal;
