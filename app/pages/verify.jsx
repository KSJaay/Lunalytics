import '../styles/pages/verify.scss';

import { StatusLogo } from '../components/icons';

const Verify = () => {
  return (
    <div className="verify-container">
      <div style={{ marginBottom: '25px' }}>
        <StatusLogo size="275" />
      </div>
      <div className="verify-description">
        Please contact the owner/admins of this dashboard to verify your
        account.
      </div>
    </div>
  );
};

export default Verify;
