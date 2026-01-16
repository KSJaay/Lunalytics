import { useNavigate } from 'react-router-dom';
import Loading from '../../components/ui/loading';
import useFetch from '../../hooks/useFetch';
import '../../styles/pages/login.scss';
import { setClientCookie } from '../../services/cookies';
import { WORKSPACE_ID_COOKIE } from '../../../shared/constants/cookies';
import { FaPlus } from 'react-icons/fa';
import { MdOutlineArrowForward } from 'react-icons/md';

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
              {[
                ...data,
                { id: '1', name: 'Bahpu', icon: '/icons/Ape.png' },
                { id: '2', name: 'KhanRyan', icon: '/icons/Bear.png' },
                { id: '3', name: 'Overwatch', icon: '/icons/Cat.png' },
                { id: '4', name: 'Potatoes', icon: '/icons/Dog.png' },
              ].map((workspace: any) => (
                <li
                  key={workspace.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 0px',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--accent-500)',
                    position: 'relative',
                  }}
                  onClick={() => handleOnclick(workspace.id)}
                >
                  <img
                    src={workspace.icon}
                    alt={`${workspace.name} avatar`}
                    style={{
                      width: '40px',
                      backgroundColor: 'var(--accent-900)',
                      borderRadius: '8px',
                      padding: '6px',
                    }}
                  />
                  <div>{workspace.name}</div>
                  <div
                    style={{
                      position: 'absolute',
                      right: '10px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <MdOutlineArrowForward size={20} />
                  </div>
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
              padding: '12px 10px',
              borderRadius: '12px',
              marginBottom: '10px',
              cursor: 'pointer',
              height: '65px',
              color: 'var(--font-light-color)',
            }}
          >
            <div
              style={{
                width: '40px',
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
