import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { IoMdEye } from 'react-icons/io';
import { PiBroadcast } from 'react-icons/pi';
import { FaTrashCan } from 'react-icons/fa6';
import { observer } from 'mobx-react-lite';

// import local files
import useContextStore from '../../context';
import StatusDeleteModal from '../modal/status/delete';
import { useNavigate } from 'react-router-dom';
import { createPostRequest } from '../../services/axios';
import { toast } from 'react-toastify';
import StatusListTable from './table';

const StatusPageTable = ({ search }) => {
  const {
    modalStore: { openModal, closeModal },
    statusStore: { allStatusPages, deleteStatusPage },
  } = useContextStore();

  const navigate = useNavigate();

  if (allStatusPages.length === 0) {
    return (
      <div className="notification-empty">
        <div className="notification-empty-icon">
          <PiBroadcast style={{ width: '64px', height: '64px' }} />
        </div>
        <div className="notification-empty-text">No status pages found</div>
      </div>
    );
  }

  const filteredStatusPages = search
    ? allStatusPages.filter(
        (statusPage) =>
          statusPage.settings.title
            .toLowerCase()
            .includes(search?.toLowerCase()) ||
          `/status/${statusPage.statusUrl?.toLowerCase()}`.includes(
            search?.toLowerCase()
          )
      )
    : allStatusPages;

  const handleDelete = async (statusPageId) => {
    await createPostRequest('/api/status-pages/delete', { statusPageId });
    deleteStatusPage(statusPageId);
    toast.success('Status page deleted successfully!');
    navigate('/status-pages');
  };

  return (
    <div className="spt-container">
      <StatusListTable
        columns={[
          { id: 'statusUrl', value: 'Status Page', align: 'left' },
          { id: 'isPublic', value: 'Access Level', align: 'left' },
          { id: 'actions', value: 'Actions', align: 'right', sortable: false },
        ]}
        rows={filteredStatusPages.map((statusPage) => {
          const url =
            statusPage.statusUrl === 'default'
              ? '/'
              : `/status/${statusPage.statusUrl}`;

          return {
            statusUrl: {
              hoverable: true,
              onClick: () =>
                navigate(
                  `/status-pages/configure?statusPageId=${statusPage.statusId}`
                ),
              value: statusPage?.settings?.title,
              component: (
                <div className="spti">
                  <div className="spti-icon">
                    <PiBroadcast />
                  </div>
                  <div className="spti-title">
                    <div>{statusPage.settings.title}</div>
                    <div className="spti-url">{url}</div>
                  </div>
                </div>
              ),
            },
            isPublic: {
              hoverable: true,
              value: statusPage?.settings?.isPublic,
              onClick: () =>
                navigate(
                  `/status-pages/configure?statusPageId=${statusPage.statusId}`
                ),
              component: (
                <div>{statusPage?.data?.isPublic ? 'Public' : 'Private'}</div>
              ),
            },
            actions: {
              component: (
                <div className="spt-actions">
                  <a href={url} target="_blank" rel="noreferrer">
                    <IoMdEye />
                  </a>
                  <div
                    className="bin"
                    onClick={() => {
                      openModal(
                        <StatusDeleteModal
                          title={statusPage.settings.title}
                          closeModal={closeModal}
                          deleteStatusPage={() =>
                            handleDelete(statusPage.statusId)
                          }
                        />
                      );
                    }}
                  >
                    <FaTrashCan />
                  </div>
                </div>
              ),
            },
          };
        })}
      />
    </div>
  );
};

StatusPageTable.displayName = 'StatusPageTable';

StatusPageTable.propTypes = {
  search: PropTypes.string,
};

export default observer(StatusPageTable);
