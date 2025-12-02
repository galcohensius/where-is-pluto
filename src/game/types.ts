export interface SceneObject {
  id: string;
  name: string;
  position: { x: number; y: number; width: number; height: number };
  visible: boolean;
}

export interface Scene {
  id: string;
  name: string;
  backgroundImage: string;
  objects: SceneObject[];
}

export interface GameState {
  currentScene: string;
  objectPositions: Record<string, Record<string, { x: number; y: number }>>;
  spacebarPressCount: Record<string, number>;
  ropeCut: Record<string, boolean>;
  hasMoved: Record<string, boolean>;
}
