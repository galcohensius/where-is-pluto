import React from 'react';
import { Scene } from '../game/types';
import { MovableCharacter } from './MovableCharacter';
import { useGameState } from '../game/GameState';
import './SceneView.css';

interface SceneViewProps {
  scene: Scene;
}

export const SceneView: React.FC<SceneViewProps> = ({ scene }) => {
  const { state } = useGameState();
  const isRopeCut = state.ropeCut[scene.id] || false;
  const hasMoved = state.hasMoved[scene.id] || false;
  const showDogSprite = hasMoved; // Only show sprite after player has moved

  // Use different background image based on rope and movement state for scene1
  let backgroundImage = scene.backgroundImage;
  if (scene.id === 'scene1') {
    if (hasMoved) {
      backgroundImage = '/pictures/scene1/p1-without-pluto.png';
    } else if (isRopeCut) {
      backgroundImage = '/pictures/scene1/p1-rope-cut.png';
    } else {
      backgroundImage = '/pictures/scene1/p1.png';
    }
  }

  return (
    <div className="scene-view">
      <div className="scene-background">
        <img src={backgroundImage} alt={scene.name} className="scene-image" />
        {scene.objects
          .filter((obj) => obj.visible)
          .map((obj) => {
            // Render dog as a movable character only after rope is cut
            if (obj.id === 'dog' && showDogSprite) {
              return <MovableCharacter key={obj.id} object={obj} />;
            }
            return null;
          })}
      </div>
    </div>
  );
};
