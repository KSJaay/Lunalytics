// import dependencies
import PropTypes from 'prop-types';
import { Textarea } from '@lunalytics/ui';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

// import local files
import { FaTrashCan } from '../../../icons';
import useStatusContext from '../../../../hooks/useConfigureStatus';

const StatusConfigureLayoutCustomCSS = ({ componentId }) => {
  const { getComponent, setComponentValue, removeComponent } =
    useStatusContext();

  const { isMinimized, data } = getComponent(componentId);

  return (
    <>
      <div className="scc-block">
        <div className="scc-title">Custom CSS</div>
        <div className="scc-description">
          CSS will be injected into the page and will apply to all components.
        </div>

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

        {!isMinimized && (
          <div className="sclh-content">
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
