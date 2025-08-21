// import dependencies
import { useState } from 'react';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { Button, Input } from '@lunalytics/ui';

// import local files
import IncidentContentImpact from './impact';
import IncidentContentHeader from './header';
import useContextStore from '../../../context';
import IncidentContentMessages from './message';
import { createPostRequest } from '../../../services/axios';
import IncidentAddUpdateModal from '../../modal/incident/addUpdate';

const IncidentContent = () => {
  const {
    modalStore: { openModal },
    incidentStore: { addIncident, activeIncident: incident },
  } = useContextStore();

  const [title, setTitle] = useState(incident?.title);

  const handleUpdate = async () => {
    try {
      if (!title || title === incident?.title) {
        return;
      }

      const updatedIncident = { ...incident, title: title };

      const response = await createPostRequest('/api/incident/update', {
        incident: updatedIncident,
      });

      addIncident(response.data);
      toast.success('Incident title has been updated successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong! Please try again later.');
    }
  };

  return (
    <div className="icp-container">
      <IncidentContentHeader incident={incident} />

      <div style={{ marginTop: '-0.5rem' }}>
        <Input
          title="Title"
          subtitle="Breif description (maximum of 100 characters)"
          value={title}
          maxLength={100}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value?.trim())
          }
          onBlur={handleUpdate}
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

export default observer(IncidentContent);
