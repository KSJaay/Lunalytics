// import local files
import { toast } from 'sonner';
import ProgressBar from '../../components/ui/progress';
import { createGetRequest } from '../../services/axios';
import { useNavigate } from 'react-router-dom';

const RegisterVerify = () => {
  const navigate = useNavigate();

  const checkIsVerified = async () => {
    try {
      const query = await createGetRequest('/api/user/verfied');

      const user = query.data;

      if (!user.isVerified) {
        return toast.error('Your account has not been verified yet.');
      }

      return navigate('/');
    } catch (error) {
      toast.error('Something went wrong while verifying your account.');
    }
  };

  return (
    <>
      <div className="auth-form-title">Verify your account</div>
      <div className="auth-form-verify-text">
        Please contact one of the dashboard administrators to verify your
        account. Once your account has been verified, you can continue to the
        dashboard.
      </div>
      <button className="auth-button" onClick={checkIsVerified}>
        Continue
      </button>

      <ProgressBar sections={3} progress={3} />
    </>
  );
};

export default RegisterVerify;
