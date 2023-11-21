const email = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return 'Email is not valid';
  }

  return false;
};

const username = (username) => {
  const regex = /^[a-zA-Z0-9]+$/;
  if (!regex.test(username)) {
    return 'Username is not valid';
  }

  return false;
};

const password = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  if (!regex.test(password)) {
    return 'Password is not valid';
  }

  return false;
};

export default { email, username, password };
