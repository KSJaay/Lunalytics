import { Button } from '@lunalytics/ui';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({
  onSubmit,
  buttonText = 'Continue',
  children,
  showForgottenPasswordCta = true,
}) => {
  const navigate = useNavigate();

  return (
    <form
      style={{ display: 'flex', flexDirection: 'column' }}
      onSubmit={onSubmit}
    >
      {children}

      {showForgottenPasswordCta ? (
        <div
          style={{
            textAlign: 'right',
            textDecoration: 'underline',
            cursor: 'pointer',
            color: 'var(--font-light-color)',
            fontSize: 'var(--font-sm)',
            padding: '12px 5px 12px 0',
          }}
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
