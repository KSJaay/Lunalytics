// import dependencies
import { toast } from 'react-toastify';
import { LuInfo } from 'react-icons/lu';
import { observer } from 'mobx-react-lite';
import { FaTrashCan } from 'react-icons/fa6';

// import local files
import useContextStore from '../../../context';
import Role from '../../../../shared/permissions/role';
import { createPostRequest } from '../../../services/axios';
import DeleteIncidentModal from '../../modal/incident/delete';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';

const HomeIncidentHeader = ({
  isInfoOpen,
  setIsInfoOpen,
  rightChildren,
  incident = {},
}) => {
  const {
    userStore: { user },
    modalStore: { openModal, closeModal },
    incidentStore: { deleteIncident },
  } = useContextStore();

  const role = new Role('user', user.permission);
  const isEditor = role.hasPermission(PermissionsBits.MANAGE_INCIDENTS);

  const handleDelete = async () => {
    try {
      await createPostRequest('/api/incident/delete', {
        incidentId: incident.incidentId,
      });

      deleteIncident(incident.incidentId);

      closeModal();
      toast.success('Incident deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to delete incident');
    }
  };

  return (
    <>
      <div className="navigation-header-content">
        <div className="navigation-header-title">
          <div>
            Incident
            {incident?.title ? ` - ${incident.title || 'Lunalytics'}` : ''}
          </div>
          {incident?.status ? (
            <div className="navigation-header-subtitle">
              Current status: <a>{incident.status}</a>
            </div>
          ) : null}
        </div>
        <div className="navigation-header-buttons">
          {isEditor ? (
            <div
              onClick={() =>
                openModal(
                  <DeleteIncidentModal
                    handleDelete={handleDelete}
                    closeModal={closeModal}
                  />
                )
              }
            >
              <FaTrashCan style={{ width: '20px', height: '20px' }} />
            </div>
          ) : null}
          {rightChildren ? (
            <div onClick={() => setIsInfoOpen(!isInfoOpen)}>
              <LuInfo size={20} />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default observer(HomeIncidentHeader);
