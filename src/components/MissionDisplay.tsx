import React from 'react';
import { useGameState } from '../game/GameState';
import './MissionDisplay.css';

export const MissionDisplay: React.FC = () => {
  const { state } = useGameState();
  const isRopeCut = state.ropeCut[state.currentScene] || false;
  const barkCount = state.spacebarPressCount[state.currentScene] || 0;
  const dogOnEdge = state.dogOnEdge[state.currentScene] || false;

  // Mission objectives for scene1
  const getMissionObjectives = () => {
    if (state.currentScene === 'scene1') {
      return [
        { id: 'cut-rope', text: 'Cut the rope', completed: isRopeCut },
        { id: 'bark-twice', text: 'Bark twice', completed: barkCount >= 2 },
        { id: 'walk-to-edge', text: 'Walk to either side', completed: dogOnEdge },
      ];
    }
    return [];
  };

  const objectives = getMissionObjectives();

  if (objectives.length === 0) return null;

  return (
    <div className="mission-display">
      <div className="mission-title">Mission</div>
      <div className="mission-list">
        {objectives.map((objective) => (
          <div
            key={objective.id}
            className={`mission-item ${objective.completed ? 'completed' : ''}`}
          >
            {objective.completed && (
              <span className="checkmark">✓</span>
            )}
            <span className="mission-text">{objective.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

