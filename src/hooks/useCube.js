import { useState } from "react";
import { createCubeState } from "../data/CreateCubeState";
import { applyMove } from "../data/moves";
import { isSolved } from "../data/isSolved";

import { useTimer }    from "./useTimer";
import { useStats }    from "./useStats";
import { useHistory }  from "./useHistory";
import { useScramble } from "./useScramble";

export function useCube() {
  const [cubeState,  setCubeState]  = useState(createCubeState);
  const [activeMove, setActiveMove] = useState(null);
  const [solved,     setSolved]     = useState(false);
  const [solveMoves, setSolveMoves] = useState(0);

  const timer    = useTimer();
  const stats    = useStats();
  const history  = useHistory();
  const scramble = useScramble();

  const busy = scramble.scrambling || !!activeMove;

  // ── Normal move dispatch ─────────────────────────────────────────────────────
  function makeMove(move, type = "move", originalMove = move) {
    if (busy || solved) return;
    if (scramble.scrambled && !timer.running && type === "move") {
      timer.start();
    }
    setActiveMove({ move, type, originalMove });
  }

  // ── Called by <Cube> onRest (after animation completes) ─────────────────────
  function finishMove() {
    if (!activeMove) return;

    const newState = applyMove(cubeState, activeMove.move);
    setCubeState(newState);

    if (scramble.scrambling) {
      setActiveMove(null);
      scramble.fireNext((nextMove) => {
        setActiveMove({ move: nextMove, type: "scramble", originalMove: nextMove });
      });
      return;
    }

    if (activeMove.type === "move" && scramble.scrambled) {
      setSolveMoves((n) => n + 1);
    }

    history.commit(activeMove.type, activeMove.move, activeMove.originalMove);

    if (scramble.scrambled && isSolved(newState)) {
      timer.stop();
      setSolved(true);
      stats.recordSolve(
        timer.time,
        activeMove.type === "move" ? solveMoves + 1 : solveMoves
      );
    }

    setActiveMove(null);
  }

  // ── Undo / Redo ──────────────────────────────────────────────────────────────
  function undo() {
    if (!history.canUndo || busy) return;
    const { move, originalMove } = history.getUndoMove();
    makeMove(move, "undo", originalMove);
  }

  function redo() {
    if (!history.canRedo || busy) return;
    const { move, originalMove } = history.getRedoMove();
    makeMove(move, "redo", originalMove);
  }

  // ── Scramble ─────────────────────────────────────────────────────────────────
  function doScramble() {
    if (busy) return;
    setSolved(false);
    history.reset();
    timer.reset();
    setSolveMoves(0);

    scramble.start({
      count: 25,
      onNextMove: (move) => {
        setActiveMove({ move, type: "scramble", originalMove: move });
      },
      onEnd: () => {
        timer.reset();
        setSolveMoves(0);
      },
    });
  }

  // ── Reset ────────────────────────────────────────────────────────────────────
  function reset() {
    if (scramble.scrambling) return;
    setCubeState(createCubeState());
    setActiveMove(null);
    setSolved(false);
    setSolveMoves(0);
    timer.reset();
    history.reset();
    scramble.reset();
  }

  // ── Public move handlers ─────────────────────────────────────────────────────
  const moves = {
    R:      () => makeMove("R"),
    RPrime: () => makeMove("R'"),
    U:      () => makeMove("U"),
    UPrime: () => makeMove("U'"),
    L:      () => makeMove("L"),
    LPrime: () => makeMove("L'"),
    F:      () => makeMove("F"),
    FPrime: () => makeMove("F'"),
    D:      () => makeMove("D"),
    DPrime: () => makeMove("D'"),
    B:      () => makeMove("B"),
    BPrime: () => makeMove("B'"),
  };

  return {
    cubeState,
    activeMove,
    solved,
    solveMoves,
    busy,
    timer,
    stats,
    history,
    scramble,
    moves,
    finishMove,
    undo,
    redo,
    doScramble,
    reset,
  };
}