// import styles
import './auth.scss';

const AuthForm = ({ title, isLogin, error, children, ...props }) => {
  return (
    <div className="auth-form-container">
      <form className="auth-form" {...props}>
        <div className="auth-form-title">{title}</div>
        {error && <div className="auth-form-error">{error}</div>}
        <div>{children}</div>
        <button type="submit" className="auth-button">
          {title}
        </button>
        {isLogin && (
          <a href="/register" className="auth-button-register">
            Register
          </a>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
