import { useState } from "react";
import { inverseMoveMap } from "../data/moves";

export function useHistory() {
  const [history,     setHistory]     = useState([]);
  const [redoStack,   setRedoStack]   = useState([]);

  // Call this AFTER the cube state is updated to keep history in sync
  function commit(type, move, originalMove) {
    if (type === "undo") {
      setHistory((h) => h.slice(0, -1));
      setRedoStack((r) => [...r, originalMove]);
    } else if (type === "redo") {
      setHistory((h) => [...h, originalMove]);
      setRedoStack((r) => r.slice(0, -1));
    } else {
      setHistory((h) => [...h, move]);
      setRedoStack([]);
    }
  }

  // Returns the move string to execute, or null if nothing to undo/redo
  function getUndoMove() {
    if (history.length === 0) return null;
    const last = history[history.length - 1];
    return { move: inverseMoveMap[last], originalMove: last };
  }

  function getRedoMove() {
    if (redoStack.length === 0) return null;
    const next = redoStack[redoStack.length - 1];
    return { move: next, originalMove: next };
  }

  function reset() {
    setHistory([]);
    setRedoStack([]);
  }

  return {
    history,
    redoStack,
    canUndo: history.length > 0,
    canRedo: redoStack.length > 0,
    commit,
    getUndoMove,
    getRedoMove,
    reset,
  };
}
