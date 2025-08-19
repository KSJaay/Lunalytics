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
import { MdArchive } from 'react-icons/md';
import ArchiveIncidentModal from '../../modal/incident/archive';
import { IoArrowBack } from 'react-icons/io5';

const HomeIncidentHeader = ({
  isInfoOpen,
  setIsInfoOpen,
  rightChildren,
  isMobile = false,
}: any) => {
  const {
    userStore: { user },
    modalStore: { openModal, closeModal },
    incidentStore: {
      addIncident,
      deleteIncident,
      activeIncident: incident,
      setActiveIncident,
    },
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

  const handleArchive = async () => {
    try {
      const updatedIncident = { ...incident, isClosed: true };
      await createPostRequest('/api/incident/update', {
        incident: updatedIncident,
      });

      addIncident(updatedIncident);
      closeModal();
      toast.success('Incident archived successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to archive incident');
    }
  };

  return (
    <div className="navigation-header-content">
      {isMobile ? (
        <div
          style={{ padding: '0 12px 0 6px' }}
          onClick={() => setActiveIncident('mobile-reset')}
        >
          <IoArrowBack size={24} />
        </div>
      ) : null}
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
          <>
            <div
              onClick={() =>
                openModal(
                  <ArchiveIncidentModal
                    closeModal={closeModal}
                    handleArchive={handleArchive}
                  />
                )
              }
            >
              <MdArchive style={{ width: '20px', height: '20px' }} />
            </div>
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
          </>
        ) : null}
        {rightChildren ? (
          <div onClick={() => setIsInfoOpen(!isInfoOpen)}>
            <LuInfo size={20} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default observer(HomeIncidentHeader);
