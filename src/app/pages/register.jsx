// import node_modules
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import local files
import Form from '../components/ui/form/auth';
import TextInput from '../components/ui/input';
import { createPostRequest } from '../services/axios';
import * as validators from '../../shared/validators';

const Register = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const email = e.target.email.value;
      const username = e.target.username.value;
      const password = e.target.password.value;

      const hasInvalidData = validators.auth(username, password, email);

      if (hasInvalidData) {
        return setError(hasInvalidData);
      }

      await createPostRequest('/register', {
        email,
        username,
        password,
      });

      navigate('/');
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  return (
    <Form title="Register" error={error} onSubmit={handleSubmit}>
      <TextInput label="Email" id="email" type="text" />
      <TextInput label="Username" id="username" type="text" />
      <TextInput label="Password" id="password" type="password" />
    </Form>
  );
};

export default Register;
