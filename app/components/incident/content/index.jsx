// import dependencies
import { Button, Input } from '@lunalytics/ui';

// import local files
import IncidentContentMessages from './message';
import IncidentContentHeader from './header';
import IncidentContentImpact from './impact';
import { observer } from 'mobx-react-lite';
import useContextStore from '../../../context';
import IncidentAddUpdateModal from '../../modal/incident/addUpdate';

const IncidentContent = ({ incident }) => {
  const {
    modalStore: { openModal },
  } = useContextStore();

  return (
    <div
      style={{
        padding: '1rem 1rem 7rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <IncidentContentHeader incident={incident} />

      <div style={{ marginTop: '-0.5rem' }}>
        <Input
          title="Title"
          subtitle="Breif description (maximum of 100 characters)"
          value={incident.title}
        />
        <IncidentContentImpact incident={incident} />
      </div>

      <IncidentContentMessages incidentId={incident.incidentId} />

      <Button
        fullWidth
        color="gray"
        variant="flat"
        onClick={() =>
          openModal(<IncidentAddUpdateModal incidentId={incident.incidentId} />)
        }
      >
        Add an update
      </Button>
    </div>
  );
};

IncidentContent.displayName = 'IncidentContent';

IncidentContent.propTypes = {};

export default observer(IncidentContent);
