import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { createSwapy } from 'swapy';
import { useEffect, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { FiMinimize, FiMaximize } from 'react-icons/fi';

// import local files
import StatusConfigureLayoutHeaderLogo from './logo';
import StatusConfigureLayoutHeaderStatus from './status';
import { FaTrashCan } from '../../../../icons';
import StatusConfigureLayoutHeaderStatusOptions from './statusOptions';
import StatusConfigureLayoutHeaderLogoOptions from './logoOptions';
import useStatusPageContext from '../../../../../context/status-page';

const StatusConfigureLayoutHeader = ({ componentId }) => {
  const swapy = useRef(null);
  const container = useRef(null);

  const { getComponent, removeComponent, setComponentValue, layoutItems } =
    useStatusPageContext();

  const component = useMemo(
    () => getComponent(componentId),
    [componentId, JSON.stringify(layoutItems)]
  );

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
      <div className="scc-block">
        <div className="scc-title">Header</div>

        <div className="scl-menu">
          <div
            className="scl-minimize"
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

          <div className="scl-bin" onClick={() => removeComponent(componentId)}>
            <FaTrashCan style={{ width: '20px', height: '20px' }} />
          </div>
        </div>

        <div className="sclh-content" ref={container}>
          <div className="sclh-item" data-swapy-slot="Left">
            <StatusConfigureLayoutHeaderLogo componentId={componentId} />
          </div>
          <div className="sclh-item" data-swapy-slot="Center"></div>
          <div className="sclh-item" data-swapy-slot="Right">
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

export default observer(StatusConfigureLayoutHeader);
