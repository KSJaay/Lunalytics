// import dependencies
import { toast } from 'react-toastify';
import { LuInfo } from 'react-icons/lu';
import { observer } from 'mobx-react-lite';
import { FaTrashCan } from 'react-icons/fa6';

// import local files
import useContextStore from '../../../context';
import Role from '../../../../shared/permissions/role';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';
import { createPostRequest } from '../../../services/axios';
import useCurrentUrl from '../../../hooks/useCurrentUrl';
import { FaCog, FaPalette, FaRegEye } from 'react-icons/fa';
import { TbLayoutFilled } from 'react-icons/tb';
import StatusDeleteModal from '../../modal/status/delete';

const menuOptions = [
  { id: 'Appearance', Icon: FaPalette },
  { id: 'Settings', Icon: FaCog },
  { id: 'Layout', Icon: TbLayoutFilled },
  { id: 'Preview', Icon: FaRegEye },
];

const HomeStatusPageHeader = ({
  isInfoOpen,
  setIsInfoOpen,
  rightChildren,
  activePage,
  setActivePage,
}) => {
  const {
    userStore: { user },
    modalStore: { openModal, closeModal },
    statusStore: { deleteStatusPage, activeStatusPage: statusPage },
  } = useContextStore();

  const baseUrl = useCurrentUrl();

  const role = new Role('user', user.permission);
  const isEditor = role.hasPermission(PermissionsBits.MANAGE_STATUS_PAGES);

  const statusPageUrl =
    statusPage?.statusUrl === 'default'
      ? baseUrl
      : `${baseUrl}/status/${statusPage?.statusUrl}`;

  const handleDelete = async () => {
    try {
      const statusPageId = statusPage?.statusId;

      await createPostRequest('/api/status-pages/delete', { statusPageId });
      setActiveNotification(null);
      deleteStatusPage(statusPageId);
      toast.success('Status page deleted successfully!');
      navigate('/status-pages');
    } catch {
      closeModal();
      toast.error('Something went wrong! Please try again later.');
    }
  };

  if (!statusPage) return null;

  return (
    <>
      <div className="navigation-header-content" style={{ border: 'none' }}>
        <div className="navigation-header-title">
          <div>
            Status Page
            {statusPage?.settings?.title
              ? ` - ${statusPage.settings.title}`
              : 'Lunalytics'}
          </div>
          {statusPage?.statusUrl ? (
            <div className="navigation-header-subtitle">
              <a href={statusPageUrl} target="_blank" rel="noreferrer">
                {statusPageUrl}
              </a>
            </div>
          ) : null}
        </div>
        <div className="navigation-header-buttons">
          {isEditor ? (
            <div
              onClick={() =>
                openModal(
                  <StatusDeleteModal
                    title={statusPage?.settings?.title || 'Lunalytics'}
                    closeModal={closeModal}
                    deleteStatusPage={handleDelete}
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

      <div
        style={{
          gap: '0.5rem',
          display: 'flex',
          padding: '0 0.5rem',
          alignItems: 'center',
          borderBottom: '1px solid var(--accent-700)',
        }}
      >
        {menuOptions.map(({ id, Icon }) => {
          const isActive = activePage === id;

          return (
            <div
              key={id}
              style={{
                borderBottom: isActive
                  ? '4px solid var(--primary-700)'
                  : '4px solid transparent',
                padding: '0.25rem 1rem 0.5rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => setActivePage(id)}
            >
              <div style={{ width: '20px', height: '20px' }}>
                <Icon style={{ width: '20px', height: '20px' }} />
              </div>
              <div>{id}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default observer(HomeStatusPageHeader);
