/*
  App.jsx
  -------
  Entry point. Calls useCube() for all state/logic,
  then wires the result into UI components + Three.js canvas.
  No logic lives here — only composition.
*/

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Cube       from "./components/Cube";
import Controls   from "./components/Controls";
import HUD        from "./components/HUD";
import StatsPanel from "./components/StatsPanel";

import { useCube }     from "./hooks/useCube";
import { useKeyboard } from "./hooks/useKeyboard";

export default function App() {
  const cube = useCube();

  // Keyboard shortcuts — hook reads from cube.moves via ref, no re-attach needed
  useKeyboard({
    handlers: cube.moves,
    disabled: cube.busy,
  });

  return (
    <>
      {/* ── Controls (top-left button bar) ──────────────────────────── */}
      <Controls
        moves={cube.moves}
        onUndo={cube.undo}
        onRedo={cube.redo}
        onReset={cube.reset}
        onScramble={cube.doScramble}
        onClearStats={cube.stats.clearAll}
        disabled={cube.busy}
      />

      {/* ── HUD (timer, move count, solved banner) ───────────────────── */}
      <HUD
        time={cube.timer.time}
        moves={cube.solveMoves}
        bestTime={cube.stats.bestTime}
        scrambleText={cube.scramble.scrambleText}
        solved={cube.solved}
      />

      {/* ── Stats panel + move history (left side) ───────────────────── */}
      <StatsPanel
        totalSolves={cube.stats.totalSolves}
        avgTime={cube.stats.avgTime}
        lastFive={cube.stats.lastFive}
        history={cube.history.history}
      />

      {/* ── Three.js canvas ──────────────────────────────────────────── */}
      <Canvas camera={{ position: [10, 10, 10], fov: 45 }}>
        <color attach="background" args={["#1a1a1a"]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]}   intensity={2} />
        <directionalLight position={[-10, -10, -10]} intensity={1} />

        <Cube
          cubeState={cube.cubeState}
          activeMove={cube.activeMove?.move}
          onMoveComplete={cube.finishMove}
        />

        <OrbitControls
          target={[0, 0, 0]}
          minDistance={8}
          maxDistance={20}
        />
      </Canvas>
    </>
  );
}
