import { useState, useEffect, useRef } from "react";

export function useTimer() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(
        () => setTime((t) => t + 1),
        1000
      );
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  function start() {
    setRunning(true);
  }

  function stop() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setTime(0);
  }

  return { time, running, start, stop, reset };
}
