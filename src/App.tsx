import React from 'react';
import { GameStateProvider } from './game/GameState';
import { SceneManager } from './game/SceneManager';
import { SceneView } from './components/SceneView';
import { ControlsDisplay } from './components/ControlsDisplay';
import { MissionDisplay } from './components/MissionDisplay';
import { Scene } from './game/types';
import { scenes } from './scenes/sceneData';
import { useGameState } from './game/GameState';
import './App.css';

const GameContent: React.FC = () => {
  const { state, updateObjectPosition, incrementSpacebarCount, setRopeCut, setHasMoved, setDogOnEdge, changeScene } = useGameState();
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
            
            // Check if all missions are complete after barking (for scene1)
            if (state.currentScene === 'scene1') {
              const barkCount = newCount; // Use newCount since we just incremented
              const isRopeCut = state.ropeCut[state.currentScene] || false;
              const dogOnEdge = state.dogOnEdge[state.currentScene] || false;
              
              // Check current position to see if still on edge
              const storedPos = state.objectPositions[state.currentScene]?.['dog'];
              const currentX = storedPos?.x ?? dog.position.x;
              const isOnLeftEdge = currentX <= 5;
              const isOnRightEdge = currentX >= 90 - dog.position.width;
              const isActuallyOnEdge = isOnLeftEdge || isOnRightEdge;
              
              // All missions must be complete: rope cut, barked twice, and reached edge
              if (isRopeCut && barkCount >= 2 && isActuallyOnEdge) {
                changeScene('scene2');
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
        
        // Check if dog is on left edge (dynamically update based on position)
        const isOnLeftEdge = newX <= 5;
        const isOnRightEdge = newX >= 90 - dog.position.width;
        setDogOnEdge(state.currentScene, isOnLeftEdge || isOnRightEdge);
        
        // Check if all missions are complete to transition to scene 2
        if (state.currentScene === 'scene1') {
          const barkCount = state.spacebarPressCount[state.currentScene] || 0;
          const isRopeCut = state.ropeCut[state.currentScene] || false;
          const dogOnEdge = isOnLeftEdge || isOnRightEdge;
          
          // All missions must be complete: rope cut, barked twice, and reached edge
          if (isRopeCut && barkCount >= 2 && dogOnEdge) {
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
        
        // Check if dog is on right edge (dynamically update based on position)
        const isOnLeftEdge = newX <= 5;
        const isOnRightEdge = newX >= 90 - dog.position.width;
        setDogOnEdge(state.currentScene, isOnLeftEdge || isOnRightEdge);
        
        // Check if all missions are complete to transition to scene 2
        if (state.currentScene === 'scene1') {
          const barkCount = state.spacebarPressCount[state.currentScene] || 0;
          const isRopeCut = state.ropeCut[state.currentScene] || false;
          const dogOnEdge = isOnLeftEdge || isOnRightEdge;
          
          // All missions must be complete: rope cut, barked twice, and reached edge
          if (isRopeCut && barkCount >= 2 && dogOnEdge) {
            changeScene('scene2');
          }
        }
      } else if (event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') {
        event.preventDefault();
        const newY = Math.max(0, currentY - 2); // Move up, min 0%
        updateObjectPosition(state.currentScene, 'dog', { x: currentX, y: newY });
        // Mark as moved when direction keys are used
        if (!state.hasMoved[state.currentScene]) {
          setHasMoved(state.currentScene, true);
        }
        
        // Update edge status (check if still on edge after vertical movement)
        const isOnLeftEdge = currentX <= 5;
        const isOnRightEdge = currentX >= 90 - dog.position.width;
        setDogOnEdge(state.currentScene, isOnLeftEdge || isOnRightEdge);
      } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
        event.preventDefault();
        const newY = Math.min(100 - dog.position.height, currentY + 2); // Move down, max 100% - height
        updateObjectPosition(state.currentScene, 'dog', { x: currentX, y: newY });
        // Mark as moved when direction keys are used
        if (!state.hasMoved[state.currentScene]) {
          setHasMoved(state.currentScene, true);
        }
        
        // Update edge status (check if still on edge after vertical movement)
        const isOnLeftEdge = currentX <= 5;
        const isOnRightEdge = currentX >= 90 - dog.position.width;
        setDogOnEdge(state.currentScene, isOnLeftEdge || isOnRightEdge);
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
  }, [state.currentScene, state.objectPositions, state.spacebarPressCount, state.ropeCut, state.hasMoved, state.dogOnEdge, updateObjectPosition, incrementSpacebarCount, setRopeCut, setHasMoved, setDogOnEdge, changeScene]);

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
      <MissionDisplay />
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
