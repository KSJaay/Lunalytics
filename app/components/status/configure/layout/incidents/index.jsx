import './styles.scss';

// import dependencies
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { FiMinimize, FiMaximize } from 'react-icons/fi';

// import local files
import Tabs from '../../../../ui/tabs';
import { FaTrashCan } from '../../../../icons';
import StatusIncidentBasic from './design/basic';
import StatusIncidentPretty from './design/pretty';
import StatusIncidentSimple from './design/simple';
import { defaultIncidents } from '../../../../../constant/status';
import {
  statusDesign,
  statusSizes,
} from '../../../../../../shared/constants/status';
import { affectTextIds } from '../../../../../../shared/constants/incident';
import useStatusPageContext from '../../../../../context/status-page';

const StatusConfigureLayoutIncidents = ({ componentId }) => {
  const { setComponentValue, getComponent, removeComponent, layoutItems } =
    useStatusPageContext;

  const { design, size, status, titleSize, isMinimized } = useMemo(
    () => getComponent(componentId),
    [componentId, JSON.stringify(layoutItems)]
  );

  return (
    <>
      <div className="scc-block">
        <div>
          <div className="scc-title">Incidents</div>
          <div className="scc-description">
            Incidents will only be visible if there is currently an ongoing
            incident.
          </div>
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

        {design === 'Minimal' ? (
          <StatusIncidentBasic status={status} incidents={defaultIncidents} />
        ) : null}

        {design === 'Simple' ? (
          <StatusIncidentSimple
            size={size}
            status={status}
            titleSize={titleSize}
            incidents={defaultIncidents}
            title="Incident title"
          />
        ) : null}

        {design === 'Pretty' ? (
          <StatusIncidentPretty
            size={size}
            status={status}
            titleSize={titleSize}
            incidents={defaultIncidents}
            title="Incident title"
          />
        ) : null}

        {!isMinimized && (
          <div className="status-configure-incidents-options">
            <div style={{ flex: 1 }}>
              <Tabs
                label="Incident color"
                options={affectTextIds}
                activeOption={status}
                onChange={(e) => setComponentValue(componentId, 'status', e)}
                shortDescription="This is for testing only and will not be saved"
              />
              <Tabs
                label="Banner size"
                options={statusSizes}
                activeOption={size}
                onChange={(e) => setComponentValue(componentId, 'size', e)}
                shortDescription="Change the size of the status banner"
              />
            </div>
            <div style={{ flex: 1 }}>
              <Tabs
                label="Title size"
                options={statusSizes}
                activeOption={titleSize}
                onChange={(e) => setComponentValue(componentId, 'titleSize', e)}
                shortDescription="Change the size of the status banner"
              />
              <Tabs
                label="Design"
                options={statusDesign}
                activeOption={design}
                onChange={(e) => setComponentValue(componentId, 'design', e)}
                shortDescription="Change the design of the status banner"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

StatusConfigureLayoutIncidents.displayName = 'StatusConfigureLayoutIncidents';

StatusConfigureLayoutIncidents.propTypes = {
  componentId: PropTypes.string.isRequired,
};

export default observer(StatusConfigureLayoutIncidents);
