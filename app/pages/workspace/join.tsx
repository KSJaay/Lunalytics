import '../../styles/pages/login.scss';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@lunalytics/ui';

import { createPostRequest } from '../../services/axios';

const WorkspaceJoinPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const workspaceName = (
        document.getElementById('workspaceName') as HTMLInputElement
      ).value?.trim();

      const workspaceIcon = (
        document.getElementById('workspaceIcon') as HTMLInputElement
      ).value?.trim();

      if (!workspaceName) {
        return toast.error('Please enter a workspace name.');
      }

      if (workspaceName.length > 32) {
        return toast.error('Workspace name must be less than 32 characters.');
      }

      await createPostRequest('/api/workspace/create', {
        name: workspaceName,
        icon: workspaceIcon,
      });

      navigate('/home');
    } catch (error) {
      toast.error('Unable to create workspace. Please try again.');
    }
  };

  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <div className="auth-form-title">Join Workspace</div>
        <div className="auth-form-subtitle">
          Enter your workspace invite code to join an existing workspace.
        </div>

        <Input id="workspaceName" title="Invite Code" isRequired />

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
