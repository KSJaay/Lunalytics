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
    const key = prevKey !== 'default' ? -1 : fallback;
    navigate(key);
  };
};

export default useGoBack;
