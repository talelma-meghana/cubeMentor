function Controls({
  handleR,
  handleRPrime,
  handleU,
  handleUPrime,
  handleL,
  handleLPrime,
  handleF,
  handleFPrime,
  handleD,
  handleDPrime,
  handleB,
  handleBPrime,
  handleReset,
  handleScramble,
  handleUndo,
  handleRedo,
  handleClearBest,
  handleClearStats,
  isMoving,
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 9999,
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        width: "300px",
      }}
    >
      <button onClick={handleR} disabled={isMoving}>R</button>
      <button onClick={handleRPrime} disabled={isMoving}>R'</button>

      <button onClick={handleU} disabled={isMoving}>U</button>
      <button onClick={handleUPrime} disabled={isMoving}>U'</button>

      <button onClick={handleL} disabled={isMoving}>L</button>
      <button onClick={handleLPrime} disabled={isMoving}>L'</button>

      <button onClick={handleF} disabled={isMoving}>F</button>
      <button onClick={handleFPrime} disabled={isMoving}>F'</button>

      <button onClick={handleD} disabled={isMoving}>D</button>
      <button onClick={handleDPrime} disabled={isMoving}>D'</button>

      <button onClick={handleB} disabled={isMoving}>B</button>
      <button onClick={handleBPrime} disabled={isMoving}>B'</button>

      <button onClick={handleUndo} disabled={isMoving}>Undo</button>
      <button onClick={handleRedo} disabled={isMoving}>Redo</button>

      <button onClick={handleReset} disabled={isMoving}>Reset</button>
      <button onClick={handleScramble} disabled={isMoving}>
      Scramble
      </button>

      <button onClick={handleClearBest}>
       Reset Best
      </button>

      <button onClick={handleClearStats}>
      Clear Stats
      </button>
    </div>
  );
}

export default Controls;