import Form from '../components/ui/authForm';
import TextInput from '../components/ui/input';

const Register = () => {
  return (
    <Form title="Register" button="Register" path={'/register'} isLogin={false}>
      <TextInput label="Email" id="email" type="text" />
      <TextInput label="Username" id="username" type="text" />
      <TextInput label="Password" id="password" type="password" />
    </Form>
  );
};

export default Register;
