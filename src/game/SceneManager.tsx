import React from 'react';
import { Scene } from './types';
import { useGameState } from './GameState';

interface SceneManagerProps {
  scenes: Record<string, Scene>;
  renderScene: (scene: Scene) => React.ReactNode;
}

export const SceneManager: React.FC<SceneManagerProps> = ({ scenes, renderScene }) => {
  const { state } = useGameState();
  const currentScene = scenes[state.currentScene];

  if (!currentScene) {
    return <div>Scene not found: {state.currentScene}</div>;
  }

  return <>{renderScene(currentScene)}</>;
};

