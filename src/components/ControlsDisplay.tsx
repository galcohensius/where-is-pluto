import React from 'react';
import { useGameState } from '../game/GameState';
import './ControlsDisplay.css';

interface ControlsDisplayProps {
  pressedKeys: Set<string>;
}

export const ControlsDisplay: React.FC<ControlsDisplayProps> = ({ pressedKeys }) => {
  const { state } = useGameState();
  const isRopeCut = state.ropeCut[state.currentScene] || false;

  const isKeyPressed = (key: string) => pressedKeys.has(key);

  return (
    <div className="controls-display">
      <div className="controls-title">Controls</div>
      <div className="controls-list">
        <div className="control-item">
          <kbd className={isKeyPressed(' ') ? 'pressed' : ''}>Space</kbd>
          <span>Barks</span>
        </div>
        {!isRopeCut && state.currentScene === 'scene1' && (
          <div className="control-item">
            <kbd className={isKeyPressed('Enter') ? 'pressed' : ''}>Enter</kbd>
            <span>Cut the rope</span>
          </div>
        )}
        {isRopeCut && (
          <div className="control-item">
            <kbd className={isKeyPressed('ArrowLeft') || isKeyPressed('a') || isKeyPressed('A') ? 'pressed' : ''}>←</kbd>
            <kbd className={isKeyPressed('ArrowRight') || isKeyPressed('d') || isKeyPressed('D') ? 'pressed' : ''}>→</kbd>
            <span>Move</span>
          </div>
        )}
      </div>
    </div>
  );
};

