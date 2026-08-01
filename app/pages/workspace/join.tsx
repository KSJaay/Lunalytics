import '../../styles/pages/login.scss';

import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, Input } from '@lunalytics/ui';

import { createPutRequest } from '../../services/axios';

const WorkspaceJoinPage = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get('inviteCode');

  const handleSubmit = async () => {
    try {
      const inviteCode = (
        document.getElementById('inviteCode') as HTMLInputElement
      ).value?.trim();

      if (!inviteCode) {
        return toast.error('Please enter an invite code.');
      }

      await createPutRequest('/api/workspace/join', {
        inviteCode,
      });

      navigate('/home');
    } catch {
      toast.error('Unable to join workspace. Please try again.');
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-form-title">Join Workspace</div>
        <div className="auth-form-subtitle">
          Enter your workspace invite code to join an existing workspace.
        </div>

        <Input
          id="inviteCode"
          title="Invite Code"
          defaultValue={inviteCode || ''}
          isRequired
        />

        <div
          className="login-text-forgot-password"
          onClick={() => navigate('/workspace/create')}
        >
          Create Workspace
        </div>

        <Button variant="flat" fullWidth onClick={handleSubmit}>
          Join Workspace
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceJoinPage;
