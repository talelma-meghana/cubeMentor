import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import Cube from "./components/Cube";
import { createCubeState } from "./data/CreateCubeState";

import Controls from "./components/Controls";

import { isSolved } from "./data/isSolved";

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
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [isScrambled, setIsScrambled] = useState(false);
  const [solved, setSolved] = useState(false);
  const [solveMoves, setSolveMoves] = useState(0);
  const [bestTime, setBestTime] = useState(
  Number(localStorage.getItem("bestTime")) || null
  );
  const [solveStats, setSolveStats] = useState(() => {
  const saved = localStorage.getItem("solveStats");

  return saved
    ? JSON.parse(saved)
    : [];
});

  useEffect(() => {
  let interval;

  if (timerRunning) {
    interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  }

  return () => clearInterval(interval);
}, [timerRunning]);



 function makeMove(move, type = "move", originalMove = move) {
  if (isScrambling || activeMove || solved) return;

  if (
    isScrambled &&
    !timerRunning &&
    type === "move"
  ) {
    setTimerRunning(true);
  }

  setActiveMove({ move, type, originalMove });
}


function finishMove() {
  if (!activeMove) return;

  const newState = applyMove(
    cubeState,
    activeMove.move
  );

  setCubeState(newState);

  const solvedNow =
    isScrambled &&
    isSolved(newState);

if (solvedNow) {
  setTimerRunning(false);
  setSolved(true);

const finalMoveCount =
  activeMove.type === "move"
    ? solveMoves + 1
    : solveMoves;

const solve = {
  time,
  moves: finalMoveCount,
  date: new Date().toLocaleString(),
};
  const updatedStats = [...solveStats, solve];

  setSolveStats(updatedStats);

  localStorage.setItem(
    "solveStats",
    JSON.stringify(updatedStats)
  );
                                      
  const storedBest =
    Number(localStorage.getItem("bestTime")) || Infinity;

  if (time < storedBest) {
    localStorage.setItem("bestTime", time);
    setBestTime(time);
  }
}

  if (activeMove.type === "undo") {
    setHistory((prev) => prev.slice(0, -1));
    setRedoHistory((prev) => [...prev, activeMove.originalMove]);
  } else if (activeMove.type === "redo") {
    setHistory((prev) => [...prev, activeMove.originalMove]);
    setRedoHistory((prev) => prev.slice(0, -1));
  } else {
  setHistory((prev) => [...prev, activeMove.move]);
  setRedoHistory([]);

  if (
  isScrambled &&
  activeMove.type === "move"
) {
  setSolveMoves((prev) => prev + 1);
}
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
  setSolved(false);
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
  setIsScrambled(true);

  setTime(0);
  setTimerRunning(false);
  setSolveMoves(0);
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

  setTime(0);
  setTimerRunning(false);
  setIsScrambled(false);
  setSolved(false);
  setSolveMoves(0);
}

function clearBestTime() {
  localStorage.removeItem("bestTime");
  setBestTime(null);
}

function clearStats() {
  localStorage.removeItem("solveStats");
  localStorage.removeItem("bestTime");

  setSolveStats([]);
  setBestTime(null);
}
useEffect(() => {
  const handleKeyDown = (event) => {
    if (isScrambling || activeMove) return;

    const key = event.key.toLowerCase();

    switch (key) {
      case "r":
        event.shiftKey ? handleRPrime() : handleR();
        break;

      case "u":
        event.shiftKey ? handleUPrime() : handleU();
        break;

      case "l":
        event.shiftKey ? handleLPrime() : handleL();
        break;

      case "f":
        event.shiftKey ? handleFPrime() : handleF();
        break;

      case "d":
        event.shiftKey ? handleDPrime() : handleD();
        break;

      case "b":
        event.shiftKey ? handleBPrime() : handleB();
        break;

      default:
        break;
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [isScrambling, activeMove, solved]);

  const totalSolves = solveStats.length;

const averageTime =
  totalSolves > 0
    ? (
        solveStats.reduce(
          (sum, solve) => sum + solve.time,
          0
        ) / totalSolves
      ).toFixed(2)
    : "--";

const lastFive = solveStats.slice(-5);


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
  handleClearStats={clearStats}
  handleClearBest={clearBestTime}
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
  Moves: {solveMoves}
</div>

<div
  style={{
    position: "fixed",
    top: "350px",
    left: "20px",
    zIndex: 9999,
    color: "white",
    background: "#222",
    padding: "10px",
    borderRadius: "8px"
  }}
>
  Time: {time}s
</div>

{solved && (
  <div
    style={{
      position: "fixed",
      //top: "750px",
      bottom: "20px",
      left: "20px",
      color: "lime",
      background: "#222",
      padding: "10px",
      borderRadius: "8px",
      zIndex: 9999
    }}
  >
   Solved! 🎉
<br />
Time: {time}s
<br />
Moves: {solveMoves}
  </div>
)}
<div
  style={{
    position: "fixed",
    top: "410px",
    left: "20px",
    zIndex: 9999,
    color: "white",
    background: "#222",
    padding: "10px",
    borderRadius: "8px"
  }}
>
  Best Time: {bestTime ? `${bestTime}s` : "--"}
</div>

<div
  style={{
    position: "fixed",
    top: "470px",
    left: "20px",
    zIndex: 9999,
    color: "white",
    background: "#222",
    padding: "10px",
    borderRadius: "8px",
    width: "250px"
  }}
>
  <strong>Statistics</strong>
  <br />

  Total Solves: {totalSolves}

  <br />

  Avg Time: {averageTime}s
</div>

<div
  style={{
    position: "fixed",
    top: "560px",
    left: "20px",
    zIndex: 9999,
    color: "white",
    background: "#222",
    padding: "10px",
    borderRadius: "8px",
    width: "250px",
    maxHeight: "150px",
    overflowY: "auto"
  }}
>
  <strong>Last 5 Solves</strong>

  <br />

  {lastFive.map((solve, index) => (
    <div key={index}>
      {solve.time}s | {solve.moves} moves
    </div>
  ))}
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
