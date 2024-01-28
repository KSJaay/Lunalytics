// import local files
import TextInput from '../../components/ui/input';
import ProgressBar from '../../components/ui/progress';

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
        <TextInput
          type="text"
          id="email"
          label="Email"
          error={errors['email']}
          defaultValue={inputs['email']}
          onBlur={handleInput}
        />
        <TextInput
          type="text"
          id="username"
          label="Username"
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

export default RegisterEmailForm;
