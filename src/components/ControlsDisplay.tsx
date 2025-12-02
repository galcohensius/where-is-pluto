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
      <div className="controls-title">מקשים</div>
      <div className="controls-list">
        <div className="control-item">
          <kbd className={isKeyPressed(' ') ? 'pressed' : ''}>Space</kbd>
          <span>הב הב</span>
        </div>
        {!isRopeCut && state.currentScene === 'scene1' && (
          <div className="control-item">
            <kbd className={isKeyPressed('Enter') ? 'pressed' : ''}>Enter</kbd>
            <span>קרע את החבל</span>
          </div>
        )}
        {isRopeCut && (
          <>
            <div className="control-item">
              <kbd className={isKeyPressed('ArrowLeft') || isKeyPressed('a') || isKeyPressed('A') ? 'pressed' : ''}>←</kbd>
              <kbd className={isKeyPressed('ArrowRight') || isKeyPressed('d') || isKeyPressed('D') ? 'pressed' : ''}>→</kbd>
              <span>צעד</span>
            </div>
            <div className="control-item">
              <kbd className={isKeyPressed('ArrowUp') || isKeyPressed('w') || isKeyPressed('W') ? 'pressed' : ''}>↑</kbd>
              <kbd className={isKeyPressed('ArrowDown') || isKeyPressed('s') || isKeyPressed('S') ? 'pressed' : ''}>↓</kbd>
              <span>צעד</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

