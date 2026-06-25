/*
  HUD.jsx
  Heads-up display: timer, move count, scramble text, solved banner.
  Pure display — zero logic.
*/

const card = (top, extra = {}) => ({
  position: "fixed",
  top,
  left: 20,
  zIndex: 9999,
  color: "#fff",
  background: "#222",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "14px",
  ...extra,
});

export default function HUD({
  time,
  moves,
  bestTime,
  scrambleText,
  solved,
}) {
  return (
    <>
      {/* Live stats */}
      <div style={card(290)}>
        Moves: <span style={{ color: "#7eb8f7" }}>{moves}</span>
      </div>

      <div style={card(345)}>
        Time: <span style={{ color: "#7eb8f7" }}>{time}s</span>
      </div>

      <div style={card(400)}>
        Best:{" "}
        <span style={{ color: "#f7c97e" }}>
          {bestTime !== null ? `${bestTime}s` : "--"}
        </span>
      </div>

      {/* Scramble sequence at bottom */}
      {scrambleText && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 9999,
            color: "#aaa",
            fontSize: "13px",
            maxWidth: "500px",
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: "#fff", fontWeight: 600 }}>Scramble: </span>
          {scrambleText}
        </div>
      )}

      {/* Solved banner */}
      {solved && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10000,
            background: "#1a2a1a",
            border: "2px solid #4caf50",
            borderRadius: "16px",
            padding: "28px 40px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "8px" }}>Solved!</div>
          <div style={{ color: "#4caf50", fontSize: "18px" }}>
            {time}s &nbsp;·&nbsp; {moves} moves
          </div>
        </div>
      )}
    </>
  );
}
