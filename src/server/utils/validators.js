const email = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const username = (username) => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(username);
};

const password = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return regex.test(password);
};

module.exports = { email, username, password };
