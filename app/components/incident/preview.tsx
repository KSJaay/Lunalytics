// import dependencies
import { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Input, Preview } from '@lunalytics/ui';

// import local files
import useContextStore from '../../context';
import { filterData } from '../../../shared/utils/search';
import type { ContextIncidentProps } from '../../../shared/types/context/incident';

const IncidentPreview = ({ children }: { children: React.ReactNode }) => {
  const {
    incidentStore: { allIncidents = [], setActiveIncident },
  } = useContextStore();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  const items = useMemo(() => {
    if (!allIncidents?.length) return [];

    return filterData(allIncidents, search, ['title', 'status', 'affect']).map(
      (incident: ContextIncidentProps) => {
        const handleOnClick = () => {
          navigate('/incidents');
          setActiveIncident(incident.incidentId);
        };

        const { incidentId = '', title = '', status = '' } = incident;

        return (
          <div
            className="navigation-preview-content"
            key={incidentId}
            onClick={handleOnClick}
          >
            <div className="navigation-preview-item">
              <div>{title}</div>
              <div className="navigation-preview-subtitle">{status}</div>
            </div>
          </div>
        );
      }
    );
  }, [search, JSON.stringify(allIncidents)]);

  const input = (
    <Input
      placeholder={t('incident.search')}
      key="search"
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
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
                {t('incident.none_exist')}
              </div>,
            ]
          : [input].concat(items)
      }
      popupClassName="navigation-preview-container"
    >
      {children}
    </Preview>
  );
};

IncidentPreview.displayName = 'IncidentPreview';

export default observer(IncidentPreview);
