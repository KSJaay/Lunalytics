const email = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const username = (username) => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(username);
};

const password = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  return regex.test(password);
};

export default { email, username, password };
