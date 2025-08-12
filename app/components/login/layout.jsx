// import dependencies
import { useNavigate } from 'react-router-dom';

// import local files
import { getProviderById } from '../../../shared/constants/provider';

const LoginLayout = ({
  showProviders = false,
  providers = [],
  title = 'Welcome Back',
  subtitle,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        <div
          style={{
            backgroundColor: 'var(--primary-900)',
            width: '100%',
            height: '70px',
            position: 'absolute',
            top: '-25px',
            left: 0,
            borderRadius: '0 0 100% 100%',
            filter: 'blur(100px)',
            zIndex: '-1',
          }}
        />
        <header style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <img
            src="/logo.svg"
            style={{ width: '50px', marginBottom: '12px' }}
          />
          <h1
            style={{
              fontSize: 'var(--font-xl)',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              style={{
                fontSize: 'var(--font-sm)',
                color: 'var(--font-light-color)',
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </header>

        {showProviders ? (
          <>
            <div className="providers">
              {providers.map((providerId) => {
                const provider = getProviderById(providerId);

                if (!provider) return null;

                return (
                  <div
                    key={provider.id}
                    className="provider-btn"
                    onClick={() =>
                      navigate(`/api/auth/platform/${provider.id}`)
                    }
                  >
                    <img
                      src={provider.icon}
                      alt={provider.name}
                      style={{ width: '25px' }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="divider">
              <div className="centered-text-with-lines">
                <span className="line" />
                <span className="text">OR</span>
                <span className="line" />
              </div>
            </div>
          </>
        ) : null}

        {children}
      </div>
    </div>
  );
};

export default LoginLayout;
