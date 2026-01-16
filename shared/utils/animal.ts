export const generateRandomAnimalName = () => {
  const adjectives = [
    'fierce',
    'playful',
    'lazy',
    'swift',
    'curious',
    'noisy',
    'gentle',
    'graceful',
    'wild',
    'sleepy',
    'happy',
    'mighty',
    'clever',
    'sneaky',
    'loyal',
  ];

  const animals = [
    'panda',
    'fox',
    'otter',
    'koala',
    'dolphin',
    'wolf',
    'rabbit',
    'bear',
    'penguin',
    'sloth',
    'pangolin',
    'mongoose',
    'badger',
  ];

  const randomItem = (arr: string[]): string =>
    arr[Math.floor(Math.random() * arr.length)];

  const adjective = randomItem(adjectives);
  const animal = randomItem(animals);

  return `${adjective}-${animal}`;
};
