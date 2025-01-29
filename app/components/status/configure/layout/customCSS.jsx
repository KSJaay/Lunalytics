// import dependencies
import PropTypes from 'prop-types';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

// import local files
import useStatusContext from '../../../../hooks/useConfigureStatus';
import { FaTrashCan } from '../../../icons';
import Textarea from '../../../ui/textarea';

const StatusConfigureLayoutCustomCSS = ({ componentId }) => {
  const { getComponent, setComponentValue, removeComponent } =
    useStatusContext();

  const { isMinimized, data } = getComponent(componentId);

  return (
    <>
      <div className="status-configure-content-block">
        <div className="status-configure-content-title">Custom CSS</div>
        <div className="status-configure-content-description">
          CSS will be injected into the page and will apply to all components.
        </div>

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

        {!isMinimized && (
          <div className="status-configure-layout-header-content">
            <Textarea
              rows={15}
              onChange={(event) => {
                setComponentValue(componentId, 'content', event.target.value);
              }}
              value={data}
            />
          </div>
        )}
      </div>
    </>
  );
};

StatusConfigureLayoutCustomCSS.displayName = 'StatusConfigureLayoutCustomCSS';

StatusConfigureLayoutCustomCSS.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default StatusConfigureLayoutCustomCSS;
