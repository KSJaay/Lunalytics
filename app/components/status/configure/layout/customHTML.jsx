// import dependencies
import PropTypes from 'prop-types';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

// import local files
import useStatusContext from '../../../../hooks/useConfigureStatus';
import { FaTrashCan } from '../../../icons';
import Textarea from '../../../ui/textarea';

const StatusConfigureLayoutCustomHTML = ({ componentId }) => {
  const { getComponent, setComponentValue, removeComponent } =
    useStatusContext();

  const { isMinimized, data } = getComponent(componentId);

  return (
    <>
      <div className="status-configure-content-block">
        <div className="status-configure-content-title">Custom HTML</div>
        <div className="status-configure-content-description">
          HTML will be injected into a div on the page and will be applied in
          the order it has been proveded.
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

StatusConfigureLayoutCustomHTML.displayName = 'StatusConfigureLayoutCustomHTML';

StatusConfigureLayoutCustomHTML.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default StatusConfigureLayoutCustomHTML;
