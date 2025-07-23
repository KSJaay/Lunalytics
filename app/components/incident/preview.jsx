// import dependencies
import { Input, Preview } from '@lunalytics/ui';

// import local files
import { fullMonitorPropType } from '../../../shared/utils/propTypes';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { filterData } from '../../../shared/utils/search';

const IncidentPreview = ({ children }) => {
  const {
    incidentStore: { allIncidents = [], setActiveIncident },
  } = useContextStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!allIncidents?.length) return [];

    return filterData(allIncidents, search, ['title', 'status', 'affect']).map(
      (incident) => {
        return (
          <div
            className="navigation-preview-content"
            key={incident.incidentId}
            onClick={() => {
              navigate('/incidents');
              setActiveIncident(incident.incidentId);
            }}
          >
            <div className="navigation-preview-item">
              <div>{incident.title || ''}</div>
              <div className="navigation-preview-subtitle">
                {incident.status || ''}
              </div>
            </div>
          </div>
        );
      }
    );
  }, [search, JSON.stringify(allIncidents)]);

  const input = (
    <Input
      placeholder="Search monitors..."
      onChange={(event) => {
        setSearch(event.target.value?.trim() || '');
      }}
    />
  );

  return (
    <Preview
      items={
        !items?.length
          ? [
              input,
              <div
                className="navigation-preview-no-items"
                key="no-incident-preview"
              >
                No incidents found
              </div>,
            ]
          : [input, ...items]
      }
      popupClassName="navigation-preview-container"
    >
      {children}
    </Preview>
  );
};

IncidentPreview.displayName = 'IncidentPreview';

IncidentPreview.propTypes = {
  monitor: fullMonitorPropType.isRequired,
};

export default observer(IncidentPreview);
