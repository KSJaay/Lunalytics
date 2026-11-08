import { Avatar } from '@lunalytics/ui';
import useFetch from '../../../../hooks/useFetch';
import Loading from '../../../ui/loading';
import { MdEdit } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';
// import { FaUsers } from 'react-icons/fa';

const ManageUsers = () => {
  const { data, isLoading } = useFetch({
    url: '/api/admin/users',
  });

  if (isLoading) {
    return <Loading maxWidth={false} />;
  }

  return (
    <div
      style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '12px' }}
    >
      {data?.users.map((user: any) => (
        <div
          key={user.id}
          style={{
            display: 'grid',
            gap: '8px',
            gridTemplateColumns: '50px 1fr 150px',
            width: '100%',
            color: 'var(--font-color)',
            backgroundColor: 'var(--accent-900)',
            padding: '8px 12px',
            borderRadius: '12px',
          }}
        >
          <Avatar
            name={user.name}
            avatarUrl={user.avatar || '/logo.svg'}
            showName={false}
          />
          <div
            style={{
              display: 'flex',
              fontSize: 'var(--font-lg)',
              flexDirection: 'column',
            }}
          >
            {user.displayName || 'Unknown'}
            <div
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--font-light-color)',
              }}
            >
              {user.email}
            </div>
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

export default ManageUsers;
