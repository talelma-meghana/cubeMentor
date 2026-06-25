import { useEffect, useRef } from "react";

/*
  handlers shape:
  {
    R, RPrime, U, UPrime, L, LPrime,
    F, FPrime, D, DPrime, B, BPrime,
  }
*/
export function useKeyboard({ handlers, disabled }) {
  // Keep a ref so we never need to re-attach the listener when handlers change
  const handlersRef = useRef(handlers);
  useEffect(() => { handlersRef.current = handlers; });

  useEffect(() => {
    function onKeyDown(e) {
      if (disabled) return;

      const key = e.key.toLowerCase();
      const shift = e.shiftKey;
      const h = handlersRef.current;

      const map = {
        r: shift ? h.RPrime : h.R,
        u: shift ? h.UPrime : h.U,
        l: shift ? h.LPrime : h.L,
        f: shift ? h.FPrime : h.F,
        d: shift ? h.DPrime : h.D,
        b: shift ? h.BPrime : h.B,
      };

      map[key]?.();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [disabled]); // only re-attaches when disabled flips
}
