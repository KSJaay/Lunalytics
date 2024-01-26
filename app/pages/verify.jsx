import './verify.scss';

import Logo from '../components/icons/logo';

const Verify = () => {
  return (
    <div className="verify-container">
      <div style={{ marginBottom: '25px' }}>
        <Logo size="275" />
      </div>
      <div className="verify-description">
        Please contact the owner of this dashboard to verify your account.
      </div>
    </div>
  );
};

export default Verify;
