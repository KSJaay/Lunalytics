import { Button } from '@lunalytics/ui';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  buttonText?: string;
  children?: React.ReactNode;
  showForgottenPasswordCta?: boolean;
}

const LoginForm = ({
  onSubmit,
  buttonText = 'Continue',
  children,
  showForgottenPasswordCta = true,
}: LoginFormProps) => {
  const navigate = useNavigate();

  return (
    <form
      style={{ display: 'flex', flexDirection: 'column' }}
      onSubmit={onSubmit}
    >
      {children}

      {showForgottenPasswordCta ? (
        <div
          className="login-text-forgot-password"
          onClick={() => navigate('/forgot-password')}
        >
          Forgot password?
        </div>
      ) : null}
      <Button fullWidth variant="border" onClick={onSubmit}>
        {buttonText}
      </Button>
    </form>
  );
};

export default LoginForm;
