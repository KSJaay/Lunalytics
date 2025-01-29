import './add.scss';

// import dependencies
import PropTypes from 'prop-types';
import { MdHistory } from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import { IoWarning } from 'react-icons/io5';
import { PiBroadcast } from 'react-icons/pi';
import { FaSignal, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { TbLayoutNavbarInactive } from 'react-icons/tb';

// import local files
import Modal from '../../../ui/modal';
import classNames from 'classnames';
import { useState } from 'react';

const components = [
  {
    name: 'Header',
    icon: (size) => (
      <TbLayoutNavbarInactive
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    ),
    type: 'header',
  },
  {
    name: 'Status',
    icon: (size) => (
      <PiBroadcast style={{ width: `${size}px`, height: `${size}px` }} />
    ),
    type: 'status',
  },
  {
    name: 'Incidents',
    icon: (size) => (
      <IoWarning style={{ width: `${size}px`, height: `${size}px` }} />
    ),
    type: 'incidents',
  },
  {
    name: 'Uptime',
    icon: (size) => (
      <FaSignal style={{ width: `${size}px`, height: `${size}px` }} />
    ),
    type: 'uptime',
  },
  {
    name: 'Metrics',
    icon: (size) => (
      <BsGraphUp style={{ width: `${size}px`, height: `${size}px` }} />
    ),
    type: 'metrics',
  },
  {
    name: 'History',
    icon: (size) => (
      <MdHistory style={{ width: `${size}px`, height: `${size}px` }} />
    ),
    type: 'history',
  },
  {
    name: 'Custom HTML',
    icon: (size) => (
      <FaHtml5 style={{ width: `${size}px`, height: `${size}px` }} />
    ),
    type: 'customHTML',
  },
  {
    name: 'Custom CSS',
    icon: (size) => (
      <FaCss3Alt style={{ width: `${size}px`, height: `${size}px` }} />
    ),
    type: 'customCSS',
  },
];

const StatusConfigureAddModal = ({ closeModal, createComponent }) => {
  const [activeComponent, setActiveComponent] = useState(null);

  return (
    <Modal.Container closeButton={closeModal}>
      <Modal.Title style={{ textAlign: 'center', fontSize: 'var(--font-xl)' }}>
        Add New Component
      </Modal.Title>
      <Modal.Message>
        <div className="scma-container">
          {components.map((component) => {
            const classes = classNames('scma-item', {
              active: component.type === activeComponent,
            });

            return (
              <div
                key={component.name}
                className={classes}
                onClick={() => {
                  setActiveComponent(component.type);
                }}
              >
                <div className="scma-item-icon">{component.icon(28)}</div>
                <div className="scma-item-name">{component.name}</div>
              </div>
            );
          })}
        </div>
      </Modal.Message>

      <Modal.Actions>
        <Modal.Button onClick={closeModal}>Close</Modal.Button>
        <Modal.Button
          color="green"
          id="monitor-create-button"
          onClick={() => {
            createComponent(activeComponent);
            closeModal();
          }}
        >
          Add
        </Modal.Button>
      </Modal.Actions>
    </Modal.Container>
  );
};

StatusConfigureAddModal.displayName = 'StatusConfigureAddModal';

StatusConfigureAddModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  createComponent: PropTypes.func.isRequired,
};

export default StatusConfigureAddModal;
