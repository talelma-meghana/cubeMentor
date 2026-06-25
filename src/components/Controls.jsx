/*
  Controls.jsx
  Pure UI — receives handlers as props, no logic inside.
*/

const BTN = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#444",
  color: "#fff",
  cursor: "pointer",
  fontSize: "13px",
};

export default function Controls({
  moves,
  onUndo,
  onRedo,
  onReset,
  onScramble,
  onClearStats,
  disabled,
}) {
  const b = (label, onClick) => (
    <button style={BTN} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 9999,
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        maxWidth: "520px",
      }}
    >
      {/* Face moves */}
      {b("R",  moves.R)}
      {b("R′", moves.RPrime)}
      {b("U",  moves.U)}
      {b("U′", moves.UPrime)}
      {b("L",  moves.L)}
      {b("L′", moves.LPrime)}
      {b("F",  moves.F)}
      {b("F′", moves.FPrime)}
      {b("D",  moves.D)}
      {b("D′", moves.DPrime)}
      {b("B",  moves.B)}
      {b("B′", moves.BPrime)}

      {/* Actions */}
      {b("Undo",         onUndo)}
      {b("Redo",         onRedo)}
      {b("Reset",        onReset)}
      {b("Scramble",     onScramble)}
      {b("Clear Stats",  onClearStats)}
    </div>
  );
}
