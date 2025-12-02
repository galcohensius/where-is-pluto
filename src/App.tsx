import React from 'react';
import { GameStateProvider } from './game/GameState';
import { SceneManager } from './game/SceneManager';
import { SceneView } from './components/SceneView';
import { ControlsDisplay } from './components/ControlsDisplay';
import { Scene } from './game/types';
import { scenes } from './scenes/sceneData';
import { useGameState } from './game/GameState';
import './App.css';

const GameContent: React.FC = () => {
  const { state, updateObjectPosition, incrementSpacebarCount, setRopeCut, setHasMoved, changeScene } = useGameState();
  const [pressedKeys, setPressedKeys] = React.useState<Set<string>>(new Set());

  // Create audio references for dog sounds
  const dogBarkAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const dogSnifingAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const ropeCutAudioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    // Initialize audio
    dogBarkAudioRef.current = new Audio('/sounds/dog-bark.mp3');
    dogBarkAudioRef.current.preload = 'auto';
    dogSnifingAudioRef.current = new Audio('/sounds/dog-snifing.mp3');
    dogSnifingAudioRef.current.preload = 'auto';
    ropeCutAudioRef.current = new Audio('/sounds/rope-cut.mp3');
    ropeCutAudioRef.current.preload = 'auto';
  }, []);

  // Counter is automatically reset when scene changes (handled in changeScene function)

  // Keyboard controls for moving the dog and playing sounds
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const currentScene = scenes[state.currentScene];
      if (!currentScene) return;

      const dog = currentScene.objects.find((o) => o.id === 'dog');
      if (!dog) return;

      // Track pressed key
      setPressedKeys((prev) => new Set(prev).add(event.key));

      // Enter key - cut the rope
      if (event.key === 'Enter') {
        event.preventDefault();
        const isRopeCut = state.ropeCut[state.currentScene] || false;
        if (!isRopeCut && state.currentScene === 'scene1') {
          // Play rope cut sound
          if (ropeCutAudioRef.current) {
            ropeCutAudioRef.current.currentTime = 0;
            ropeCutAudioRef.current.play().catch((error) => {
              console.error('Error playing rope cut sound:', error);
            });
          }
          // Set rope as cut (enables movement)
          setRopeCut(state.currentScene, true);
        }
        return;
      }

      // Spacebar - play dog sound based on press count
      if (event.key === ' ') {
        event.preventDefault();
        
        const currentCount = state.spacebarPressCount[state.currentScene] || 0;
        const newCount = currentCount + 1;
        
        // Increment the counter
        incrementSpacebarCount(state.currentScene);
        
        // If pressed more than 3 times, play sniffing sound, otherwise play bark
        if (newCount > 3) {
          if (dogSnifingAudioRef.current) {
            dogSnifingAudioRef.current.currentTime = 0;
            dogSnifingAudioRef.current.play().catch((error) => {
              console.error('Error playing sniffing sound:', error);
            });
          }
        } else {
          if (dogBarkAudioRef.current) {
            dogBarkAudioRef.current.currentTime = 0;
            dogBarkAudioRef.current.play().catch((error) => {
              console.error('Error playing bark sound:', error);
            });
          }
        }
        return;
      }

      // Movement keys - only work if rope is cut
      const isRopeCut = state.ropeCut[state.currentScene] || false;
      if (!isRopeCut) return; // Can't move until rope is cut

      // Get current position (use stored position or default from scene)
      const storedPos = state.objectPositions[state.currentScene]?.['dog'];
      const currentX = storedPos?.x ?? dog.position.x;
      const currentY = storedPos?.y ?? dog.position.y;

      if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
        event.preventDefault();
        const newX = Math.max(0, currentX - 2); // Move left, min 0%
        updateObjectPosition(state.currentScene, 'dog', { x: newX, y: currentY });
        // Mark as moved when direction keys are used
        if (!state.hasMoved[state.currentScene]) {
          setHasMoved(state.currentScene, true);
        }
        
        // Check if dog reached left edge to transition to scene 2
        // Requirements: rope cut, barked at least twice, and reached edge
        if (state.currentScene === 'scene1') {
          const barkCount = state.spacebarPressCount[state.currentScene] || 0;
          const isRopeCut = state.ropeCut[state.currentScene] || false;
          if (isRopeCut && barkCount >= 2 && newX <= 5) {
            changeScene('scene2');
          }
        }
      } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
        event.preventDefault();
        const newX = Math.min(100 - dog.position.width, currentX + 2); // Move right, max 100% - width
        updateObjectPosition(state.currentScene, 'dog', { x: newX, y: currentY });
        // Mark as moved when direction keys are used
        if (!state.hasMoved[state.currentScene]) {
          setHasMoved(state.currentScene, true);
        }
        
        // Check if dog reached right edge to transition to scene 2
        // Requirements: rope cut, barked at least twice, and reached edge
        if (state.currentScene === 'scene1') {
          const barkCount = state.spacebarPressCount[state.currentScene] || 0;
          const isRopeCut = state.ropeCut[state.currentScene] || false;
          if (isRopeCut && barkCount >= 2 && newX >= 90 - dog.position.width) {
            changeScene('scene2');
          }
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Remove key from pressed set
      setPressedKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(event.key);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [state.currentScene, state.objectPositions, state.spacebarPressCount, state.ropeCut, state.hasMoved, updateObjectPosition, incrementSpacebarCount, setRopeCut, setHasMoved, changeScene]);

  const renderScene = (scene: Scene) => {
    // Apply position overrides from state
    const sceneWithPositions = {
      ...scene,
      objects: scene.objects.map((obj) => {
        const storedPos = state.objectPositions[scene.id]?.[obj.id];
        if (storedPos) {
          return {
            ...obj,
            position: {
              ...obj.position,
              x: storedPos.x,
              y: storedPos.y,
            },
          };
        }
        return obj;
      }),
    };
    return <SceneView scene={sceneWithPositions} />;
  };

  return (
    <div className="App">
      <ControlsDisplay pressedKeys={pressedKeys} />
      <SceneManager scenes={scenes} renderScene={renderScene} />
    </div>
  );
};

function App() {
  return (
    <GameStateProvider>
      <GameContent />
    </GameStateProvider>
  );
}

export default App;
