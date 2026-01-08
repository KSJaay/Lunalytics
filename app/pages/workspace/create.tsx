import '../../styles/pages/login.scss';

import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button, Input } from '@lunalytics/ui';

import { createPostRequest } from '../../services/axios';

const WorkspaceCreatePage = () => {
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
        <div className="auth-form-title">Create Workspace</div>
        <div className="auth-form-subtitle">
          Workspaces can be used to organize your projects and collaborate with
          your team.
        </div>

        <Input
          id="workspaceName"
          title="Workspace Name"
          placeholder="Workspace Name"
          isRequired
        />
        <Input
          id="workspaceIcon"
          title="Workspace Icon"
          placeholder="https://lunalytics.xyz/logo.svg"
        />

        <div
          className="login-text-forgot-password"
          onClick={() => navigate('/workspace/join')}
        >
          Join Workspace
        </div>

        <Button variant="flat" fullWidth onClick={handleSubmit}>
          Create Workspace
        </Button>
      </div>
    </div>
  );
};

export default WorkspaceCreatePage;
