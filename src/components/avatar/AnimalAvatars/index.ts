import { Cat } from './Cat';
import { Dog } from './Dog';
import { Rabbit } from './Rabbit';
import { Bear } from './Bear';
import { Fox } from './Fox';
import { Panda } from './Panda';
import { Owl } from './Owl';
import { Penguin } from './Penguin';
import { Lion } from './Lion';
import { Giraffe } from './Giraffe';
import type { FC } from 'react';

interface AnimalProps { size: number; color: string; secondaryColor: string; }

export const ANIMALS: FC<AnimalProps>[] = [
  Cat, Dog, Rabbit, Bear, Fox, Panda, Owl, Penguin, Lion, Giraffe,
];

export { Cat, Dog, Rabbit, Bear, Fox, Panda, Owl, Penguin, Lion, Giraffe };
