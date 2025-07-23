import './style.scss';

// import dependencies
import { Input, Preview } from '@lunalytics/ui';

// import local files
import { fullMonitorPropType } from '../../../shared/utils/propTypes';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../context';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IncidentPreview = ({ children }) => {
  const {
    incidentStore: { allIncidents = [], setActiveIncident },
  } = useContextStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const items = useMemo(() => {
    if (!allIncidents?.length) return [];

    return allIncidents
      .filter((incident) => {
        if (search) {
          const lowercaseSearch = search?.toLowerCase() || '';
          return (
            incident?.title?.toLowerCase()?.includes(lowercaseSearch) ||
            incident?.status?.toLowerCase()?.includes(lowercaseSearch) ||
            incident?.affect?.toLowerCase()?.includes(lowercaseSearch)
          );
        }
        return true;
      })
      .map((incident) => {
        return (
          <div
            className="incident-preview-content"
            key={incident.incidentId}
            onClick={() => {
              navigate('/incidents');
              setActiveIncident(incident.incidentId);
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div>{incident.title || ''}</div>
              <div
                style={{
                  fontSize: 'var(--font-sm)',
                  color: 'var(--font-light-color)',
                }}
              >
                {incident.status || ''}
              </div>
            </div>
          </div>
        );
      });
  }, [search, JSON.stringify(allIncidents)]);

  if (!items?.length) return children;

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
        items.length > 0
          ? [input, ...items]
          : [
              input,
              <div
                style={{
                  padding: '3rem 0',
                  textAlign: 'center',
                  color: 'var(--font-light-color)',
                }}
                key="no-incident-preview"
              >
                No incidents found
              </div>,
            ]
      }
      popupClassName="incident-preview-container"
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
