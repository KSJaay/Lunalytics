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

const isImageUrl = (url) => {
  if (typeof url !== 'string') {
    return false;
  }

  return url.match(/^https?:\/\//gim);
};

const isAvatar = (avatar) => {
  if (avatar === null) {
    return false;
  }

  if (!defaultAvatars.includes(avatar) && !isImageUrl(avatar)) {
    return 'Avatar must be a valid image URL or one of the default avatars.';
  }

  return false;
};

export { isAvatar };
