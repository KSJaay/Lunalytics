// import dependencies
import { toast } from 'react-toastify';
import { LuInfo } from 'react-icons/lu';
import { observer } from 'mobx-react-lite';
import { MdArchive } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';
import { IoArrowBack } from 'react-icons/io5';

// import local files
import useModalContext from '../../../context/modal';
import useMemberContext from '../../../context/member';
import useIncidentContext from '../../../context/incidents';
import { createPostRequest } from '../../../services/axios';
import DeleteIncidentModal from '../../modal/incident/delete';
import ArchiveIncidentModal from '../../modal/incident/archive';
import { MemberPermissionBits } from '../../../../shared/permissions/bitFlags';

interface HomeIncidentHeaderProps {
  isInfoOpen?: boolean;
  setIsInfoOpen?: (isOpen: boolean) => void;
  rightChildren?: React.ReactNode;
  isMobile?: boolean;
}

const HomeIncidentHeader = ({
  isInfoOpen,
  setIsInfoOpen,
  rightChildren,
  isMobile = false,
}: HomeIncidentHeaderProps) => {
  const { openModal, closeModal } = useModalContext();
  const {
    addIncident,
    deleteIncident,
    activeIncident: incident,
    setActiveIncident,
  } = useIncidentContext();
  const { member } = useMemberContext();

  const isEditor = member?.role.hasPermission(
    MemberPermissionBits.MANAGE_INCIDENTS
  );

  const handleDelete = async () => {
    try {
      if (!incident) return;

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
      if (!incident) return;

      const updatedIncident = {
        ...incident,
        isClosed: true,
        title: incident.title ?? '',
        incidentId: incident.incidentId ?? '',
        affect: incident.affect ?? 'Incident',
        status: incident.status ?? 'Investigating',
        messages: incident.messages ?? [],
        monitorIds: incident.monitorIds ?? [],
      };

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
        {isEditor && incident ? (
          <>
            <div
              id="incident-header-archive-button"
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
              id="incident-header-delete-button"
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
          <div
            id="incident-header-info-button"
            onClick={() => setIsInfoOpen?.(!isInfoOpen)}
          >
            <LuInfo size={20} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default observer(HomeIncidentHeader);
