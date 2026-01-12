// import dependencies
import { toast } from 'react-toastify';
import { LuInfo } from 'react-icons/lu';
import { observer } from 'mobx-react-lite';
import { FaTrashCan } from 'react-icons/fa6';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { TbLayoutFilled } from 'react-icons/tb';
import { FaCog, FaPalette, FaRegEye } from 'react-icons/fa';

// import local files
import useContextStore from '../../../context';
import useCurrentUrl from '../../../hooks/useCurrentUrl';
import StatusDeleteModal from '../../modal/status/delete';
import { createPostRequest } from '../../../services/axios';
import { PermissionsBits } from '../../../../shared/permissions/bitFlags';
import useMemberContext from '../../../context/member';

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
  isMobile = false,
}) => {
  const {
    modalStore: { openModal, closeModal },
    statusStore: {
      deleteStatusPage,
      activeStatusPage: statusPage,
      setActiveStatusPage,
    },
  } = useContextStore();
  const navigate = useNavigate();

  const baseUrl = useCurrentUrl();

  const { member } = useMemberContext();

  const isEditor = member?.role.hasPermission(
    PermissionsBits.MANAGE_STATUS_PAGES
  );

  const statusPageUrl =
    statusPage?.statusUrl === 'default'
      ? baseUrl
      : `${baseUrl}/status/${statusPage?.statusUrl}`;

  const handleDelete = async () => {
    try {
      const statusPageId = statusPage?.statusId;

      await createPostRequest('/api/status-pages/delete', { statusPageId });
      setActiveStatusPage(null);
      deleteStatusPage(statusPageId);
      toast.success('Status page deleted successfully!');
      navigate('/status-pages');
    } catch (error) {
      console.log(error);
      closeModal();
      toast.error('Something went wrong! Please try again later.');
    }
  };

  if (!statusPage) return null;

  return (
    <>
      <div className="navigation-header-content" style={{ border: 'none' }}>
        {isMobile ? (
          <div
            style={{ padding: '0 12px 0 6px' }}
            onClick={() => setActiveStatusPage('mobile-reset')}
          >
            <IoArrowBack size={24} />
          </div>
        ) : null}
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

      <div className="smc-options">
        {menuOptions.map(({ id, Icon }) => {
          const isActive = activePage === id;

          return (
            <div
              key={id}
              style={{
                borderBottom: isActive
                  ? '4px solid var(--primary-700)'
                  : '4px solid transparent',
              }}
              className="smc-options-item"
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
