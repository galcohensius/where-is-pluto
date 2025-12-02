import { Scene } from '../game/types';

export const scene1: Scene = {
  id: 'scene1',
  name: 'Pluto-tied-to-a-tree',
  backgroundImage: '/pictures/scene1/p1.png',
  objects: [
    {
      id: 'dog',
      name: 'Dog',
      position: { x: 30, y: 35, width: 25, height: 40 },
      visible: true,
    },
  ],
};

export const scene2: Scene = {
  id: 'scene2',
  name: 'Scene 2',
  backgroundImage: '/pictures/scene2/p2.png',
  objects: [
    {
      id: 'dog',
      name: 'Dog',
      position: { x: 10, y: 20, width: 25, height: 40 },
      visible: true,
    },
  ],
};

export const scenes: Record<string, Scene> = {
  scene1,
  scene2,
};
