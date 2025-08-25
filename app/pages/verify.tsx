import '../styles/pages/verify.scss';
import { Button } from '@lunalytics/ui';
import { StatusLogo } from '../components/icons';
import { useNavigate } from 'react-router-dom';
import { createGetRequest } from '../services/axios';
import { toast } from 'react-toastify';

const Verify = () => {
  const navigate = useNavigate();

  const checkIsVerified = async () => {
    try {
      const query = await createGetRequest('/api/user/verfied');

      const user = query.data;

      if (!user.isVerified) {
        return toast.error('Your account has not been verified yet.');
      }

      return navigate('/home');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong while verifying your account.');
    }
  };

  return (
    <div className="verify-container">
      <div style={{ marginBottom: '25px' }}>
        <StatusLogo size={150} />
      </div>
      <div className="verify-title">Verify your account</div>
      <div className="verify-description">
        Please contact one of the dashboard administrators to verify your
        account. Once your account has been verified, you can continue to the
        dashboard.
      </div>

      <Button onClick={checkIsVerified} variant="flat">
        Continue
      </Button>
    </div>
  );
};

export default Verify;
