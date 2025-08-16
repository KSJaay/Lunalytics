import { useLocation, useNavigate } from 'react-router-dom';

const useGoBack = () => {
  const { key: prevKey } = useLocation();
  const navigate = useNavigate();

  return ({ fallback = '/home' } = {}) => {
    if (prevKey !== 'default') {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };
};

export default useGoBack;
