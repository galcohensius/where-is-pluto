import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState as GameStateType } from './types';

interface GameStateContextType {
  state: GameStateType;
  changeScene: (sceneId: string) => void;
  updateObjectPosition: (sceneId: string, objectId: string, position: { x: number; y: number }) => void;
  incrementSpacebarCount: (sceneId: string) => void;
  resetSpacebarCount: (sceneId: string) => void;
  setRopeCut: (sceneId: string, cut: boolean) => void;
  setHasMoved: (sceneId: string, moved: boolean) => void;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

const initialState: GameStateType = {
  currentScene: 'scene1',
  objectPositions: {},
  spacebarPressCount: {},
  ropeCut: {},
  hasMoved: {},
};

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameStateType>(initialState);

  const changeScene = (sceneId: string) => {
    setState((prev: GameStateType) => ({
      ...prev,
      currentScene: sceneId,
      spacebarPressCount: {
        ...prev.spacebarPressCount,
        [sceneId]: 0, // Reset counter when changing scenes
      },
      ropeCut: {
        ...prev.ropeCut,
        [sceneId]: false, // Reset rope state for new scene
      },
      hasMoved: {
        ...prev.hasMoved,
        [sceneId]: false, // Reset movement state for new scene
      },
    }));
  };

  const incrementSpacebarCount = (sceneId: string) => {
    setState((prev: GameStateType) => ({
      ...prev,
      spacebarPressCount: {
        ...prev.spacebarPressCount,
        [sceneId]: (prev.spacebarPressCount[sceneId] || 0) + 1,
      },
    }));
  };

  const resetSpacebarCount = (sceneId: string) => {
    setState((prev: GameStateType) => ({
      ...prev,
      spacebarPressCount: {
        ...prev.spacebarPressCount,
        [sceneId]: 0,
      },
    }));
  };

  const setRopeCut = (sceneId: string, cut: boolean) => {
    setState((prev: GameStateType) => ({
      ...prev,
      ropeCut: {
        ...prev.ropeCut,
        [sceneId]: cut,
      },
    }));
  };

  const setHasMoved = (sceneId: string, moved: boolean) => {
    setState((prev: GameStateType) => ({
      ...prev,
      hasMoved: {
        ...prev.hasMoved,
        [sceneId]: moved,
      },
    }));
  };

  const updateObjectPosition = (sceneId: string, objectId: string, position: { x: number; y: number }) => {
    setState((prev: GameStateType) => ({
      ...prev,
      objectPositions: {
        ...prev.objectPositions,
        [sceneId]: {
          ...prev.objectPositions[sceneId],
          [objectId]: position,
        },
      },
    }));
  };

  return (
    <GameStateContext.Provider
      value={{
        state,
        changeScene,
        updateObjectPosition,
        incrementSpacebarCount,
        resetSpacebarCount,
        setRopeCut,
        setHasMoved,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
