import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Cube from "./components/Cube";
import { createCubeState } from "./data/CreateCubeState";

import Controls from "./components/Controls";

import {
  generateScramble,
  moveMap,
  inverseMoveMap,
  applyMove
} from "./data/moves";

function App() {

  const [cubeState, setCubeState] = useState(
    createCubeState()
  );
  const [scrambleText, setScrambleText] = useState("");
  const [history, setHistory] = useState([]);

  const [redoHistory, setRedoHistory] = useState([]);
  const [isScrambling, setIsScrambling] = useState(false);
  const [activeMove, setActiveMove] = useState(null);

 function makeMove(move, type = "move", originalMove = move) {
  if (isScrambling || activeMove) return;
  setActiveMove({ move, type, originalMove });
}

function finishMove() {
  if (!activeMove) return;

  setCubeState((prev) => applyMove(prev, activeMove.move));

  if (activeMove.type === "undo") {
    setHistory((prev) => prev.slice(0, -1));
    setRedoHistory((prev) => [...prev, activeMove.originalMove]);
  } else if (activeMove.type === "redo") {
    setHistory((prev) => [...prev, activeMove.originalMove]);
    setRedoHistory((prev) => prev.slice(0, -1));
  } else {
    setHistory((prev) => [...prev, activeMove.move]);
    setRedoHistory([]);
  }

  setActiveMove(null);
}

const handleR = () => makeMove("R");
const handleRPrime = () => makeMove("R'");

const handleU = () => makeMove("U");
const handleUPrime = () => makeMove("U'");

const handleL = () => makeMove("L");
const handleLPrime = () => makeMove("L'");

const handleF = () => makeMove("F");
const handleFPrime = () => makeMove("F'");

const handleD = () => makeMove("D");
const handleDPrime = () => makeMove("D'");

const handleB = () => makeMove("B");
const handleBPrime = () => makeMove("B'");

function scrambleCube() {
  if (isScrambling || activeMove) return;
  setIsScrambling(true);

  const scramble = generateScramble(25);

  setScrambleText(
    scramble.join(" ")
  );

  let index = 0;

  const interval = setInterval(() => {

    const move = scramble[index];

    setCubeState(prev =>
      moveMap[move](prev)
    );

    index++;

    if(index >= scramble.length) {
      clearInterval(interval);
      setIsScrambling(false);
    }

  }, 300);
}

function handleUndo() {
  if (history.length === 0 || isScrambling || activeMove) return;

  const lastMove = history[history.length - 1];
  makeMove(inverseMoveMap[lastMove], "undo", lastMove);
}

function handleRedo() {
  if (redoHistory.length === 0 || isScrambling || activeMove) return;

  const moveToRedo = redoHistory[redoHistory.length - 1];
  makeMove(moveToRedo, "redo", moveToRedo);
}


function handleReset() {
  if (isScrambling || activeMove) return;

  setCubeState(createCubeState());
  setHistory([]);
  setRedoHistory([]);
  setScrambleText("");
}


  return (
    <>
      <Controls
  handleR={handleR}
  handleRPrime={handleRPrime}
  handleU={handleU}
  handleUPrime={handleUPrime}
  handleL={handleL}
  handleLPrime={handleLPrime}
  handleF={handleF}
  handleFPrime={handleFPrime}
  handleD={handleD}
  handleDPrime={handleDPrime}
  handleB={handleB}
  handleBPrime={handleBPrime}
  handleReset={handleReset}
  handleScramble={scrambleCube}
  handleUndo={handleUndo}
  handleRedo={handleRedo}
  isMoving={Boolean(activeMove) || isScrambling}
/>

<div
  style={{
    position: "fixed",
    bottom: "20px",
    left: "20px",
    color: "white",
    zIndex: 9999,
    width: "500px"
  }}
>
  <strong>Scramble:</strong>
  <br />
  {scrambleText}
</div>
<div
  style={{
    position: "fixed",
    top: "120px",
    left: "20px",
    zIndex: 9999,
    color: "white",
    width: "350px",
    maxHeight: "150px",
    overflowY: "auto",
    background: "#222",
    padding: "10px",
    borderRadius: "8px"
  }}
>
  <strong>Move History</strong>
  <br />
  {history.join(" ")}
</div>

<div
  style={{
    position: "fixed",
    top: "290px",
    left: "20px",
    zIndex: 9999,
    color: "white",
    background: "#222",
    padding: "10px",
    borderRadius: "8px"
  }}
>
  Moves: {history.length}
</div>
        <Canvas
  camera={{
    position: [10, 10, 10],
    fov: 45,
  }}
>

        <color attach="background" args={["#1a1a1a"]} />

        <ambientLight intensity={1.5} />

        <directionalLight
          position={[10, 10, 10]}
          intensity={2}
        />

        <directionalLight
          position={[-10, -10, -10]}
          intensity={1}
        />

        <Cube
          cubeState={cubeState}
          activeMove={activeMove?.move}
          onMoveComplete={finishMove}
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

export default App;
