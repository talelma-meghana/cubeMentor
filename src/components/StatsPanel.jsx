/*
  StatsPanel.jsx
  Displays solve statistics and move history.
  Pure display — zero logic.
*/

const panel = (top, extra = {}) => ({
  position: "fixed",
  top,
  left: 20,
  zIndex: 9999,
  color: "#fff",
  background: "#222",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "13px",
  width: "260px",
  ...extra,
});

export default function StatsPanel({ totalSolves, avgTime, lastFive, history }) {
  return (
    <>
      {/* Move history */}
      <div
        style={{
          ...panel(120),
          maxHeight: "140px",
          overflowY: "auto",
          wordBreak: "break-all",
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "4px" }}>
          Move History
        </div>
        <span style={{ color: "#aaa" }}>
          {history.length > 0 ? history.join(" ") : "—"}
        </span>
      </div>

      {/* Aggregate stats */}
      <div style={panel(460)}>
        <div style={{ fontWeight: 600, marginBottom: "6px" }}>Statistics</div>
        <div>Total solves: {totalSolves}</div>
        <div>Avg time: {avgTime !== null ? `${avgTime}s` : "--"}</div>
      </div>

      {/* Last 5 solves */}
      <div style={{ ...panel(550), maxHeight: "160px", overflowY: "auto" }}>
        <div style={{ fontWeight: 600, marginBottom: "6px" }}>Last 5 Solves</div>
        {lastFive.length === 0 && (
          <span style={{ color: "#666" }}>No solves yet</span>
        )}
        {lastFive.map((s, i) => (
          <div key={i} style={{ color: "#aaa", marginBottom: "2px" }}>
            {s.time}s &nbsp;·&nbsp; {s.moves} moves
          </div>
        ))}
      </div>
    </>
  );
}
