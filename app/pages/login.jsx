// import node_modules
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import local files
import Form from '../components/ui/form/auth';
import TextInput from '../components/ui/input';
import { createPostRequest } from '../services/axios';
import * as validators from '../utils/validators';

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const username = e.target.username.value;
      const password = e.target.password.value;

      const hasInvalidData = validators.auth(username, password);

      if (hasInvalidData) {
        return setError(hasInvalidData);
      }

      await createPostRequest('/login', { username, password });

      navigate('/verify');
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
