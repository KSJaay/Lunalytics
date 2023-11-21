// import node_modules
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import local files
import Form from '../components/ui/authForm';
import TextInput from '../components/ui/input';
import Axios from '../services/axios';
import validators from '../utils/validators';

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const username = e.target.username.value;
      const password = e.target.password.value;

      const isEmail = new RegExp(/@/g).test(username);
      const isInvalidUsername = isEmail
        ? validators.email(username)
        : validators.username(username);

      if (isInvalidUsername) {
        return setError(isInvalidUsername);
      }

      const isInvalidPassword = validators.password(password);
      if (isInvalidPassword) {
        return setError(isInvalidPassword);
      }

      await Axios('POST', '/login', { username, password });

      navigate('/');
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  return (
    <Form title="Login" isLogin={true} error={error} onSubmit={handleSubmit}>
      <TextInput label="Email or username" id="username" type="text" />
      <TextInput label="Password" id="password" type="password" />
    </Form>
  );
};

export default Login;
