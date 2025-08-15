import { useLocation, useNavigate } from 'react-router-dom';

/**
 * A function that returns a function to navigate back to the previous location or a fallback location.
 *
 * @param {Object} prev - an object containing the previous location and fallback location
 * @return {void}
 */
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
