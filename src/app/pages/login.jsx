import Form from '../components/ui/authForm';
import TextInput from '../components/ui/input';

const Login = () => {
  return (
    <Form title="Login" button="Login" path={'/login'} isLogin={true}>
      <TextInput label="Email or username" id="email" type="text" />
      <TextInput label="Password" id="password" type="password" />
    </Form>
  );
};

export default Login;
