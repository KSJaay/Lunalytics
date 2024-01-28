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

const isAvatar = (avatar) => {
  if (!defaultAvatars.includes(avatar)) {
    return 'Avatar must be a valid Imgur URL or one of the default avatars.';
  }

  return false;
};

module.exports = { isAvatar };
