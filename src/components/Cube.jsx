import { useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/three";
import Cubie from "./Cubie";

const moveAnimation = {
  R:   { axis: 0, layer:  1, angle: -Math.PI / 2 },
  "R'":{ axis: 0, layer:  1, angle:  Math.PI / 2 },
  L:   { axis: 0, layer: -1, angle:  Math.PI / 2 },
  "L'":{ axis: 0, layer: -1, angle: -Math.PI / 2 },
  U:   { axis: 1, layer:  1, angle:  Math.PI / 2 },
  "U'":{ axis: 1, layer:  1, angle: -Math.PI / 2 },
  D:   { axis: 1, layer: -1, angle: -Math.PI / 2 },
  "D'":{ axis: 1, layer: -1, angle:  Math.PI / 2 },
  F:   { axis: 2, layer:  1, angle: -Math.PI / 2 },
  "F'":{ axis: 2, layer:  1, angle:  Math.PI / 2 },
  B:   { axis: 2, layer: -1, angle:  Math.PI / 2 },
  "B'":{ axis: 2, layer: -1, angle: -Math.PI / 2 },
};

function Cube({ cubeState, activeMove, onMoveComplete }) {
  const [spring, api] = useSpring(() => ({ rotation: [0, 0, 0] }));

  // Track whether we are mid-animation so onRest only fires for real moves.
  // Without this, api.set({rotation:[0,0,0]}) also triggers onRest,
  // causing onMoveComplete to fire twice per click.
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!activeMove) {
      // Reset silently — NOT an animation, must NOT call onMoveComplete
      isAnimatingRef.current = false;
      api.set({ rotation: [0, 0, 0] });
      return;
    }

    const { axis, angle } = moveAnimation[activeMove];
    const rotation = [0, 0, 0];
    rotation[axis] = angle;

    isAnimatingRef.current = true;

    api.start({
      from:   { rotation: [0, 0, 0] },
      to:     { rotation },
      config: { tension: 260, friction: 24 },
      onRest: () => {
        // Guard: only call onMoveComplete when WE started this animation
        if (isAnimatingRef.current) {
          isAnimatingRef.current = false;
          onMoveComplete();
        }
      },
    });
  }, [activeMove]); // removed api and onMoveComplete from deps intentionally —
                    // they are stable refs and adding them caused extra re-runs

  const animation      = activeMove ? moveAnimation[activeMove] : null;
  const isTurningCubie = (cubie) =>
    animation && cubie.position[animation.axis] === animation.layer;

  return (
    <group position={[0, 0, 0]}>
      {cubeState.filter((c) => !isTurningCubie(c)).map((cubie) => (
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
