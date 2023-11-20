// import styles
import './authForm.scss';

const Form = ({ button, path, title, isLogin, children }) => {
  return (
    <div className="auth-form-container">
      <form className="auth-form" method="POST" action={path}>
        <div className="auth-form-title">{title}</div>
        <div>{children}</div>
        <button type="submit" className="auth-button">
          {button}
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

export default Form;
