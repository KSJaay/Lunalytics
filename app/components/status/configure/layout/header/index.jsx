import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { createSwapy } from 'swapy';
import { useEffect, useRef } from 'react';
import { FiMinimize, FiMaximize } from 'react-icons/fi';

// import local files
import StatusConfigureLayoutHeaderLogo from './logo';
import StatusConfigureLayoutHeaderStatus from './status';
import { FaTrashCan } from '../../../../icons';
import StatusConfigureLayoutHeaderStatusOptions from './statusOptions';
import StatusConfigureLayoutHeaderLogoOptions from './logoOptions';
import useStatusContext from '../../../../../hooks/useConfigureStatus';

const StatusConfigureLayoutHeader = ({ componentId }) => {
  const swapy = useRef(null);
  const container = useRef(null);

  const { getComponent, removeComponent, setComponentValue } =
    useStatusContext();
  const component = getComponent(componentId);
  const { isMinimized } = component;

  useEffect(() => {
    if (container.current) {
      swapy.current = createSwapy(container.current);

      swapy.current.onSwap((event) => {
        const slotMap = event.newSlotItemMap.asArray;

        slotMap.forEach((obj) => {
          const { slot, item } = obj;

          if (component[item]) {
            setComponentValue(componentId, item, { position: slot });
          }
        });
      });
    }

    return () => {
      swapy.current?.destroy();
    };
  }, []);

  return (
    <>
      <div className="status-configure-content-block">
        <div className="status-configure-content-title">Header</div>

        <div className="status-configure-layout-menu">
          <div
            className="status-configure-layout-minimize"
            onClick={() =>
              setComponentValue(componentId, 'isMinimized', !isMinimized)
            }
          >
            {isMinimized ? (
              <FiMaximize style={{ width: '20px', height: '20px' }} />
            ) : (
              <FiMinimize style={{ width: '20px', height: '20px' }} />
            )}
          </div>

          <div
            className="status-configure-layout-bin"
            onClick={() => removeComponent(componentId)}
          >
            <FaTrashCan style={{ width: '20px', height: '20px' }} />
          </div>
        </div>

        <div className="status-configure-layout-header-content" ref={container}>
          <div
            className="status-configure-layout-header-item"
            data-swapy-slot="Left"
          >
            <StatusConfigureLayoutHeaderLogo componentId={componentId} />
          </div>
          <div
            className="status-configure-layout-header-item"
            data-swapy-slot="Center"
          ></div>
          <div
            className="status-configure-layout-header-item"
            data-swapy-slot="Right"
          >
            <StatusConfigureLayoutHeaderStatus componentId={componentId} />
          </div>
        </div>

        {!isMinimized && (
          <div style={{ display: 'flex', gap: '50px' }}>
            <StatusConfigureLayoutHeaderLogoOptions componentId={componentId} />
            <StatusConfigureLayoutHeaderStatusOptions
              componentId={componentId}
            />
          </div>
        )}
      </div>
    </>
  );
};

StatusConfigureLayoutHeader.displayName = 'StatusConfigureLayoutHeader';

StatusConfigureLayoutHeader.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default StatusConfigureLayoutHeader;
