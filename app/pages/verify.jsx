import './verify.scss';

import Logo from '../components/icons/statusLogo';

const Verify = () => {
  return (
    <div className="verify-container">
      <div style={{ marginBottom: '25px' }}>
        <Logo size="275" />
      </div>
      <div className="verify-description">
        Please contact the owner/admins of this dashboard to verify your
        account.
      </div>
    </div>
  );
};

export default Verify;
