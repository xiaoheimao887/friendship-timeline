export interface AnimalAvatarResult {
  animalIndex: number;
  primaryColor: string;
  secondaryColor: string;
  animalName: string;
}

const ANIMAL_NAMES = ['cat', 'dog', 'rabbit', 'bear', 'fox', 'panda', 'owl', 'penguin', 'lion', 'giraffe'];

const PRIMARY_COLORS = [
  '#E8A87C', '#95D1CC', '#F7B5CA', '#C9B1FF', '#FFD57A',
  '#A8D8EA', '#F19A9A', '#B5EAD7', '#FFC8A2', '#C3AED6',
];

const SECONDARY_COLORS = [
  '#F0C5B6', '#C5E8E5', '#FCD5E3', '#DDC8FF', '#FFE8AA',
  '#C5E5F5', '#FCC5C5', '#D5F0E3', '#FFE0C5', '#DCC8E8',
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getAnimalAvatar(name: string): AnimalAvatarResult {
  const hash = simpleHash(name);
  const animalIndex = hash % ANIMAL_NAMES.length;
  const colorIndex = Math.floor(hash / ANIMAL_NAMES.length) % PRIMARY_COLORS.length;

  return {
    animalIndex,
    primaryColor: PRIMARY_COLORS[colorIndex],
    secondaryColor: SECONDARY_COLORS[colorIndex],
    animalName: ANIMAL_NAMES[animalIndex],
  };
}

export const ANIMAL_COUNT = ANIMAL_NAMES.length;
