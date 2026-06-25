import { useState } from "react";

const STATS_KEY = "cubeStats";
const BEST_KEY  = "cubeBestTime";

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY)) ?? [];
  } catch {
    return [];
  }
}

function loadBest() {
  const v = Number(localStorage.getItem(BEST_KEY));
  return v > 0 ? v : null;
}

export function useStats() {
  const [solves, setSolves] = useState(loadStats);
  const [bestTime, setBestTime] = useState(loadBest);

  function recordSolve(time, moves) {
    const entry = { time, moves, date: new Date().toLocaleString() };
    setSolves((prev) => {
      const next = [...prev, entry];
      localStorage.setItem(STATS_KEY, JSON.stringify(next));
      return next;
    });
    if (bestTime === null || time < bestTime) {
      setBestTime(time);
      localStorage.setItem(BEST_KEY, time);
    }
  }

  function clearAll() {
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(BEST_KEY);
    setSolves([]);
    setBestTime(null);
  }

  const totalSolves = solves.length;

  const avgTime =
    totalSolves > 0
      ? (solves.reduce((s, x) => s + x.time, 0) / totalSolves).toFixed(2)
      : null;

  const lastFive = solves.slice(-5);

  return {
    solves,
    bestTime,
    avgTime,
    lastFive,
    totalSolves,
    recordSolve,
    clearAll,
  };
}
