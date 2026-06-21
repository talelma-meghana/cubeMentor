import { useEffect } from "react";
import { animated, useSpring } from "@react-spring/three";
import Cubie from "./Cubie";

// Rotation direction and the cubie layer for every face move.
const moveAnimation = {
  R: { axis: 0, layer: 1, angle: -Math.PI / 2 },
  "R'": { axis: 0, layer: 1, angle: Math.PI / 2 },
  L: { axis: 0, layer: -1, angle: Math.PI / 2 },
  "L'": { axis: 0, layer: -1, angle: -Math.PI / 2 },
  U: { axis: 1, layer: 1, angle: Math.PI / 2 },
  "U'": { axis: 1, layer: 1, angle: -Math.PI / 2 },
  D: { axis: 1, layer: -1, angle: -Math.PI / 2 },
  "D'": { axis: 1, layer: -1, angle: Math.PI / 2 },
  F: { axis: 2, layer: 1, angle: -Math.PI / 2 },
  "F'": { axis: 2, layer: 1, angle: Math.PI / 2 },
  B: { axis: 2, layer: -1, angle: Math.PI / 2 },
  "B'": { axis: 2, layer: -1, angle: -Math.PI / 2 },
};

function Cube({ cubeState, activeMove, onMoveComplete }) {
  const [spring, api] = useSpring(() => ({ rotation: [0, 0, 0] }));

  useEffect(() => {
    if (!activeMove) {
      api.set({ rotation: [0, 0, 0] });
      return;
    }

    const { axis, angle } = moveAnimation[activeMove];
    const rotation = [0, 0, 0];
    rotation[axis] = angle;

    api.start({
      from: { rotation: [0, 0, 0] },
      to: { rotation },
      config: { tension: 260, friction: 24 },
      onRest: onMoveComplete,
    });
  }, [activeMove, api, onMoveComplete]);

  const animation = activeMove ? moveAnimation[activeMove] : null;
  const isTurningCubie = (cubie) =>
    animation && cubie.position[animation.axis] === animation.layer;

  return (
    <group position={[0, 0, 0]}>
      {cubeState.filter((cubie) => !isTurningCubie(cubie)).map((cubie) => (
        <Cubie key={cubie.id} position={cubie.position} stickers={cubie.stickers} />
      ))}

      <animated.group rotation={spring.rotation}>
        {cubeState.filter(isTurningCubie).map((cubie) => (
          <Cubie key={cubie.id} position={cubie.position} stickers={cubie.stickers} />
        ))}
      </animated.group>
    </group>
  );
}

export default Cube;
