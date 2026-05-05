import { Avatar } from '@lunalytics/ui';
import useFetch from '../../../../hooks/useFetch';
import Loading from '../../../ui/loading';
import { MdEdit } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';
import { FaUsers } from 'react-icons/fa';

const ManageWorkspaces = () => {
  const { data, isLoading } = useFetch({
    url: '/api/admin/workspaces',
  });

  if (isLoading) {
    return <Loading maxWidth={false} />;
  }

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      {data?.workspaces.map((ws: any) => (
        <div
          key={ws.id}
          style={{
            display: 'grid',
            gap: '8px',
            gridTemplateColumns: '50px 1fr 150px 1fr',
            width: '100%',
            color: 'var(--font-color)',
            backgroundColor: 'var(--accent-900)',
            padding: '8px 12px',
            borderRadius: '12px',
          }}
        >
          <Avatar
            name={ws.name}
            avatarUrl={ws.icon || '/logo.svg'}
            showName={false}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 'var(--font-lg)',
              flexDirection: 'column',
            }}
          >
            {ws.name}
            <div
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--font-light-color)',
              }}
            >
              {ws.ownerId}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--font-lg)',
              color: 'var(--font-light-color)',
            }}
          >
            {ws.memberCount}
            <FaUsers size={24} />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: 'var(--accent-800)',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <MdEdit size={20} />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: 'var(--accent-800)',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <FaTrashCan size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageWorkspaces;
