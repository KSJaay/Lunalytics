// import node_modules
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = true;

    if (!isLoggedIn) {
      navigate('/login');
    }
  }, []);

  return children;
};

export default Auth;
