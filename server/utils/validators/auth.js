const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

const auth = (username, password, email) => {
  if (!email) {
    const isEmail = new RegExp(/@/g).test(username);
    if (isEmail && !emailRegex.test(username)) {
      return 'Email is not valid';
    }

    if (!isEmail && !usernameRegex.test(username)) {
      return 'Username is not valid';
    }
  }

  if (email) {
    if (!emailRegex.test(email)) {
      return 'Email is not valid';
    }

    if (username.length < 3 || username.length > 16) {
      return 'Username must be between 3 and 16 characters.';
    }

    if (!usernameRegex.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and dashes.';
    }
  }

  if (!passwordRegex.test(password)) {
    return 'Password is not valid';
  }

  return false;
};

module.exports = auth;
