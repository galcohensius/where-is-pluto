# Where Pluto - Puzzle Game

A web-based puzzle game built with React and TypeScript that follows the plot of a beloved book.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The game will automatically open in your browser at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Game Structure

The game is built with a modular architecture:

- **Game Engine** (`src/game/`): Core game logic, state management, and puzzle engine
- **Scenes** (`src/scenes/`): Scene definitions and data
- **Components** (`src/components/`): Reusable UI components (SceneView, InteractiveObject, DialogBox, Inventory)

## Adding New Scenes

To add a new scene:

1. Create a new scene object in `src/scenes/sceneData.ts`
2. Add it to the `scenes` record
3. Define interactive objects with their positions and interactions
4. The scene will automatically be available through the SceneManager

## Project Structure

```
where-pluto/
├── public/
│   └── pictures/          # Scene images
├── src/
│   ├── components/         # UI components
│   ├── game/              # Game engine
│   ├── scenes/            # Scene definitions
│   ├── App.tsx            # Main app component
│   └── index.tsx          # Entry point
└── package.json
```

## Technology Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Modern ES modules** - No legacy dependencies

