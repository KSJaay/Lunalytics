import '../../styles/pages/incidents.scss';

// import dependencies
import dayjs from 'dayjs';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';

// import local files
import useContextStore from '../../context';
import { createPostRequest } from '../../services/axios';
import { PermissionsBits } from '../../../shared/permissions/bitFlags';
import Role from '../../../shared/permissions/role';
import Button from '../../components/ui/button';
import IncidentIdMessage from '../../components/incident/id/message';
import IncidentIdHeader from '../../components/incident/id/header';
import IncidentIdTitle from '../../components/incident/id/title';
import IncidentAddUpdateModal from '../../components/modal/incident/addUpdate';
import DeleteIncidentModal from '../../components/modal/incident/delete';

dayjs.extend(relativeTime);

const IncidentUpdate = () => {
  const {
    userStore: { user },
    incidentStore: { getIncidentById, addIncident, deleteIncident },
    modalStore: { openModal, closeModal },
  } = useContextStore();
  const [isFocused, setFocused] = useState(false);
  const navigate = useNavigate();

  const searchParams = useParams();
  const incidentId = searchParams['incidentId'];

  const incident = getIncidentById(incidentId);

  if (!incident) return null;

  const canManageIncidents = new Role('user', user.permission).hasPermission(
    PermissionsBits.MANAGE_INCIDENTS
  );

  const handleClick = async (key, value) => {
    try {
      const updatedIncident = { ...incident, [key]: value };

      const response = await createPostRequest('/api/incident/update', {
        incident: updatedIncident,
      });

      addIncident(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTitleChange = async (input) => {
    if (isFocused) {
      if (input === incident.title) {
        setFocused(!isFocused);
        return;
      }

      if (!input) {
        toast.error('Please enter a title');
      }

      handleClick('title', input);
    }

    setFocused(!isFocused);
  };

  const handleDelete = async () => {
    try {
      await createPostRequest('/api/incident/delete', {
        incidentId: incidentId,
      });

      deleteIncident(incidentId);

      closeModal();
      navigate('/incidents');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="icu">
      <div className="icu-container">
        <IncidentIdTitle
          title={incident.title}
          isFocused={isFocused}
          handleChange={handleTitleChange}
          canManageIncidents={canManageIncidents}
        />

        <IncidentIdHeader
          incident={incident}
          handleClick={handleClick}
          canManageIncidents={canManageIncidents}
        />

        {canManageIncidents && (
          <div style={{ padding: '4px 12px' }}>
            <Button
              fullWidth
              outline="primary"
              onClick={() => {
                openModal(
                  <IncidentAddUpdateModal incidentId={incidentId} />,
                  false
                );
              }}
            >
              Add an update
            </Button>
          </div>
        )}

        <div className="incident-items-container">
          {incident.messages
            .map((message, index) => (
              <IncidentIdMessage
                key={index}
                incidentPosition={index}
                incidentId={incidentId}
                message={message.message}
                status={message.status}
                createdAt={message.createdAt}
              />
            ))
            .reverse()}
        </div>

        {canManageIncidents && (
          <div style={{ padding: '4px 12px 20px 12px' }}>
            <Button
              fullWidth
              outline="red"
              onClick={() => {
                openModal(
                  <DeleteIncidentModal
                    handleDelete={handleDelete}
                    closeModal={closeModal}
                  />,
                  false
                );
              }}
            >
              Delete Incident
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

IncidentUpdate.displayName = 'IncidentUpdate';

IncidentUpdate.propTypes = {};

export default observer(IncidentUpdate);
