// import dependencies
import { ProgressBar, Input } from '@lunalytics/ui';

const RegisterEmailForm = ({
  handleInput,
  handlePageChange,
  inputs = {},
  errors = {},
}) => {
  return (
    <>
      <div className="auth-form-title">Create your account</div>
      <div className="auth-form-subtitle">
        Please provide your name and email
      </div>
      <div>
        <Input
          type="text"
          id="email"
          title="Email"
          error={errors['email']}
          defaultValue={inputs['email']}
          onBlur={handleInput}
        />
        <Input
          type="text"
          id="username"
          title="Username"
          error={errors['username']}
          defaultValue={inputs['username']}
          onBlur={handleInput}
        />
      </div>
      <button
        className="auth-button"
        onClick={() => handlePageChange('password')}
      >
        Continue
      </button>
      <div className="auth-form-footer">
        Already have an account?{' '}
        <a
          style={{
            fontWeight: 'bold',
            color: 'var(--primary-500)',
            textDecoration: 'underline',
          }}
          href="/login"
        >
          Login
        </a>
      </div>

      <ProgressBar sections={3} />
    </>
  );
};

RegisterEmailForm.displayName = 'RegisterEmailForm';

export default RegisterEmailForm;
