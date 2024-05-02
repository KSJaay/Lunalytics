// regex to check user has only letters, numbers, underscore, dash, spaces and should be 3-24 characters long
const usernameRegex = /^[a-zA-Z0-9_\- ]{3,32}$/;
// regex to check if email is valid
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,254}$/;
// regex to check if one letter, one number or special character, atleast 8 characters long and max of 64 characters long
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*~_\-+=]).{8,64}$/;

const email = (email = '') => {
  if (email.length < 3 || email.length > 254) {
    return { email: 'Email must be between 3 and 254 characters.' };
  }

  if (!emailRegex.test(email)) {
    return { email: 'Email is not valid' };
  }

  return false;
};

const username = (username = '') => {
  if (username.length < 3 || username.length > 32) {
    return { username: 'Username must be between 3 and 32 characters.' };
  }

  if (!usernameRegex.test(username)) {
    return {
      username:
        'Username can only contain letters, numbers, underscores, and dashes.',
    };
  }

  return false;
};

const password = (password = '') => {
  if (password.length < 8 || password.length > 64) {
    return { password: 'Password must be between 8 and 64 characters.' };
  }

  if (!passwordRegex.test(password)) {
    return { password: 'Password is not valid' };
  }

  return false;
};

const auth = { email, username, password };

export default auth;
