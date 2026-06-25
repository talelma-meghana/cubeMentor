import { createCubeState } from "./CreateCubeState";

export function isSolved(cubeState) {
  const solvedState = createCubeState();

  return JSON.stringify(cubeState) === JSON.stringify(solvedState);
}