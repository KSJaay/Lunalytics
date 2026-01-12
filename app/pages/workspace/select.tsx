import { useNavigate } from 'react-router-dom';
import Loading from '../../components/ui/loading';
import useFetch from '../../hooks/useFetch';
import '../../styles/pages/login.scss';
import { setClientCookie } from '../../services/cookies';
import { WORKSPACE_ID_COOKIE } from '../../../shared/constants/cookies';
import { FaPlus } from 'react-icons/fa';

const WorkspaceSelectPage = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useFetch({
    url: '/api/user/workspaces',
    onSuccess: (data) => {
      if (data?.length < 1) {
        return navigate('/workspace/create');
      }
    },
    onFailure: (error: any) => {
      if (error.response && error.response.status === 401) {
        return navigate('/login');
      }

      return navigate('/error');
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const handleOnclick = (workspaceId: string) => {
    setClientCookie(WORKSPACE_ID_COOKIE, workspaceId);
    navigate('/home');
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-form-title">Select Workspace</div>
        <div className="auth-form-subtitle">
          Choose an existing workspace or create a new one to get started.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data && data.length > 0 ? (
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '550px',
                overflowY: 'auto',
                backgroundColor: 'var(--accent-800)',
                borderRadius: '12px',
                padding: '0 10px',
              }}
            >
              {[...data, ...data, ...data, ...data].map((workspace: any) => (
                <li
                  key={workspace.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '15px 0',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--accent-500)',
                  }}
                  onClick={() => handleOnclick(workspace.id)}
                >
                  <img
                    src={workspace.icon}
                    alt={`${workspace.name} avatar`}
                    style={{ width: '32px' }}
                  />
                  <div>{workspace.name}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div>No workspaces found.</div>
          )}
          <li
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: 'var(--accent-800)',
              padding: '10px',
              borderRadius: '12px',
              marginBottom: '10px',
              cursor: 'pointer',
              height: '52px',
              color: 'var(--font-light-color)',
            }}
          >
            <div
              style={{
                width: '32px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FaPlus size={20} />
            </div>
            Add New Workspace
          </li>
        </div>
      </div>
    </div>
  );
};

WorkspaceSelectPage.displayName = 'WorkspaceSelectPage';

export default WorkspaceSelectPage;
