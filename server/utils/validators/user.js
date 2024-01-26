const defaultAvatars = [
  'Ape',
  'Bear',
  'Cat',
  'Dog',
  'Doggo',
  'Duck',
  'Eagle',
  'Fox',
  'Gerbil',
  'Hamster',
  'Hedgehog',
  'Koala',
  'Ostrich',
  'Panda',
  'Rabbit',
  'Rocket',
  'Tiger',
];

const isUsername = (username) => {
  const regex = /^[a-zA-Z0-9_-]{3,16}$/;

  if (username.length < 3 || username.length > 16) {
    return 'Username must be between 3 and 16 characters.';
  }

  if (!regex.test(username)) {
    return 'Username can only contain letters, numbers, underscores, and dashes.';
  }

  return false;
};

const isAvatar = (avatar) => {
  if (!defaultAvatars.includes(avatar)) {
    return 'Avatar must be a valid Imgur URL or one of the default avatars.';
  }

  return false;
};

module.exports = { isUsername, isAvatar };
