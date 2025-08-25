// import dependencies
import { ProgressBar, Input } from '@lunalytics/ui';

// import local files
import RegisterChecklist from './checklist';

interface RegisterPasswordFormProps {
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  setPassword: (password: string) => void;
  inputs?: Record<string, any>;
  errors?: Record<string, any>;
}

const RegisterPasswordForm = ({
  handleInput,
  handleSubmit,
  setPassword,
  inputs = {},
  errors = {},
}: RegisterPasswordFormProps) => {
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

export default RegisterPasswordForm;
