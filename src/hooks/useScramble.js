import { useState, useRef } from "react";
import { generateScramble } from "../data/moves";

/*
  useScramble — queue-based, animation-safe scrambler.

  ROOT CAUSE OF THE BLACK SCREEN BUG:
  The old interval fired setCubeState() 25 times in rapid succession,
  completely bypassing the activeMove gate. Three.js received 25 state
  updates while it was still animating the first move → render pile-up
  → canvas freeze → black screen.

  FIX:
  Don't touch cubeState at all here. Instead, expose a queue of moves
  and a "fire next" function. useCube calls fireNext() inside finishMove()
  so each scramble move only starts AFTER the previous animation completes.
  This is the same pipeline normal moves use — guaranteed safe.
*/
export function useScramble() {
  const [scrambling,   setScrambling]   = useState(false);
  const [scrambled,    setScrambled]    = useState(false);
  const [scrambleText, setScrambleText] = useState("");

  // Internal queue — a ref so reads inside finishMove are always fresh
  const queueRef    = useRef([]);
  const onEndRef    = useRef(null);

  /*
    Call this to start a scramble.
    - generateMoves  : move strings to play (default: 25 random)
    - onNextMove(m)  : called with each move string — useCube feeds it into setActiveMove
    - onEnd()        : called when the last move finishes
  */
  function start({ onNextMove, onEnd, count = 25 }) {
    const moves = generateScramble(count);
    queueRef.current = [...moves];
    onEndRef.current = onEnd;

    setScrambleText(moves.join(" "));
    setScrambling(true);
    setScrambled(false);

    // Fire the very first move immediately
    const first = queueRef.current.shift();
    onNextMove(first);
  }

  /*
    Called by useCube inside finishMove() while scrambling is true.
    Fires the next queued move, or ends the scramble if queue is empty.
  */
  function fireNext(onNextMove) {
    if (queueRef.current.length === 0) {
      // All moves done
      setScrambling(false);
      setScrambled(true);
      onEndRef.current?.();
      return;
    }
    const next = queueRef.current.shift();
    onNextMove(next);
  }

  function reset() {
    queueRef.current = [];
    setScrambling(false);
    setScrambled(false);
    setScrambleText("");
  }

  return {
    scrambling,
    scrambled,
    scrambleText,
    start,
    fireNext,
    reset,
  };
}