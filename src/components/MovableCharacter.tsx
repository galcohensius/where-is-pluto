import React from 'react';
import { SceneObject } from '../game/types';
import './MovableCharacter.css';

interface MovableCharacterProps {
  object: SceneObject;
}

export const MovableCharacter: React.FC<MovableCharacterProps> = ({ object }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${object.position.x}%`,
    top: `${object.position.y}%`,
    width: `${object.position.width}%`,
    height: `${object.position.height}%`,
  };

  return (
    <div className="movable-character" style={style} title={object.name}>
      <img 
        src="/pictures/scene1/Pluto-with-rope-removebg.png" 
        alt={object.name}
        className="character-sprite dog-sprite"
      />
    </div>
  );
};
