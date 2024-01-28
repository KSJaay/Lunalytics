// import local files
import TextInput from '../../components/ui/input';
import ProgressBar from '../../components/ui/progress';
import RegisterChecklist from './checklist';

const RegisterPasswordForm = ({
  handleInput,
  handleSubmit,
  setPassword,
  inputs = {},
  errors = {},
}) => {
  return (
    <>
      <div className="auth-form-title">Choose a password</div>
      <div className="auth-form-subtitle">Please enter your password</div>
      <div>
        <TextInput
          type="password"
          id="password"
          label="Password"
          error={errors['password']}
          defaultValue={inputs['password']}
          onInput={setPassword}
          onBlur={handleInput}
        />

        <RegisterChecklist password={inputs['password']} />

        <TextInput
          type="password"
          id="confirmPassword"
          label="Confirm password"
          error={errors['confirmPassword']}
          defaultValue={inputs['confirmPassword']}
          onBlur={handleInput}
        />
      </div>
      <button type="submit" className="auth-button" onClick={handleSubmit}>
        Register
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

      <ProgressBar sections={3} progress={2} />
    </>
  );
};

export default RegisterPasswordForm;
