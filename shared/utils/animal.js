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
    'tiger',
    'fox',
    'otter',
    'panda',
    'eagle',
    'koala',
    'lion',
    'dolphin',
    'wolf',
    'rabbit',
    'bear',
    'falcon',
    'zebra',
    'giraffe',
    'leopard',
    'penguin',
    'rhino',
    'sloth',
    'hyena',
    'cheetah',
  ];

  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const adjective = randomItem(adjectives);
  const animal = randomItem(animals);

  return `${adjective}-${animal}`;
};
