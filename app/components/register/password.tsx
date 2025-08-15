// import dependencies
import PropTypes from 'prop-types';
import { ProgressBar, Input } from '@lunalytics/ui';

// import local files
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
        <Input
          type="password"
          id="password"
          title="Password"
          error={errors['password']}
          defaultValue={inputs['password']}
          onInput={setPassword}
          onBlur={handleInput}
        />

        <RegisterChecklist password={inputs['password']} />

        <Input
          type="password"
          id="confirmPassword"
          title="Confirm password"
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

RegisterPasswordForm.displayName = 'RegisterPasswordForm';

RegisterPasswordForm.propTypes = {
  handleInput: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setPassword: PropTypes.func.isRequired,
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

export default RegisterPasswordForm;
