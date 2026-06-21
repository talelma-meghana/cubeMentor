export function moveR(state) {

  return state.map((cubie) => {

    const [x, y, z] = cubie.position;

    if (x !== 1) {
      return cubie;
    }

    const newStickers = {
      ...cubie.stickers
    };

    const temp = newStickers.up;

    newStickers.up = newStickers.front;
    newStickers.front = newStickers.down;
    newStickers.down = newStickers.back;
    newStickers.back = temp;

    return {
      ...cubie,

      position: [x, z, -y],

      stickers: newStickers
    };
  });

}

export function moveRPrime(state) {

return state.map((cubie) => {

    const [x, y, z] = cubie.position;

    if (x !== 1) {
      return cubie;
    }
    const newStickers = {
      ...cubie.stickers
    };

    const temp = newStickers.up;

    newStickers.up = newStickers.back;
    newStickers.back = newStickers.down;
    newStickers.down = newStickers.front;
    newStickers.front = temp;

    return {
      ...cubie,

      position: [x, -z, y],

      stickers: newStickers
    };
  });

  
}

export function moveU(state) {
  return state.map((cubie) => {
    const [x, y, z] = cubie.position;

    if (y !== 1) return cubie;

    const stickers = { ...cubie.stickers };

    const temp = stickers.left;
    stickers.left = stickers.back;
    stickers.back = stickers.right;
    stickers.right = stickers.front;
    stickers.front = temp;

    return {
      ...cubie,
      position: [z, y, -x],
      stickers,
    };
  });
}

export function moveUPrime(state) {
  return state.map((cubie) => {
    const [x, y, z] = cubie.position;

    if (y !== 1) return cubie;

    const stickers = { ...cubie.stickers };

    const temp = stickers.left;
    stickers.left = stickers.front;
    stickers.front = stickers.right;
    stickers.right = stickers.back;
    stickers.back = temp;

    return {
      ...cubie,
      position: [-z, y, x],
      stickers,
    };
  });
}

export function moveL(state) {
  return state.map((cubie) => {
    const [x, y, z] = cubie.position;

    if (x !== -1) return cubie;

    const stickers = { ...cubie.stickers };

    const temp = stickers.down;
    stickers.down = stickers.front;
    stickers.front = stickers.up;
    stickers.up = stickers.back;
    stickers.back = temp;

    return {
      ...cubie,
      position: [x, -z, y],
      stickers,
    };
  });
}

export function moveLPrime(state) {
  return state.map((cubie) => {
    const [x, y, z] = cubie.position;

    if (x !== -1) return cubie;

    const stickers = { ...cubie.stickers };

    const temp = stickers.up;
    stickers.up = stickers.front;
    stickers.front = stickers.down;
    stickers.down = stickers.back;
    stickers.back = temp;

    return {
      ...cubie,
      position: [x, z, -y],
      stickers,
    };
  });
}

export function moveF(state) {
  return state.map((cubie) => {
    const [x, y, z] = cubie.position;

    if (z !== 1) return cubie;

    const stickers = { ...cubie.stickers };

    const temp = stickers.up;
    stickers.up = stickers.left;
    stickers.left = stickers.down;
    stickers.down = stickers.right;
    stickers.right = temp;

    return {
      ...cubie,
      position: [y, -x, z],
      stickers,
    };
  });
}

export function moveFPrime(state) {
  return state.map((cubie) => {
    const [x, y, z] = cubie.position;

    if (z !== 1) return cubie;

    const stickers = { ...cubie.stickers };

    const temp = stickers.up;
    stickers.up = stickers.right;
    stickers.right = stickers.down;
    stickers.down = stickers.left;
    stickers.left = temp;

    return {
      ...cubie,
      position: [-y, x, z],
      stickers,
    };
  });
}

export function moveD(state) {
  return state.map((cubie) => {
    const [x, y, z] = cubie.position;

    if (y !== -1) return cubie;

    const s = { ...cubie.stickers };

    const temp = s.left;
    s.left = s.front;
    s.front = s.right;
    s.right = s.back;
    s.back = temp;

    return {
      ...cubie,
      position: [-z, y, x],
      stickers: s,
    };
  });
}

export function moveDPrime(state) {
  return state.map((cubie) => {
    const [x, y, z] = cubie.position;

    if (y !== -1) return cubie;

    const s = { ...cubie.stickers };

    const temp = s.left;
    s.left = s.back;
    s.back = s.right;
    s.right = s.front;
    s.front = temp;

    return {
      ...cubie,
      position: [z, y, -x],
      stickers: s,
    };
  });
}

export function moveB(state) {
  return state.map((cubie) => {
    const [x, y, z] = cubie.position;

    if (z !== -1) return cubie;

    const s = { ...cubie.stickers };

    s.up = cubie.stickers.right;
    s.right = cubie.stickers.down;
    s.down = cubie.stickers.left;
    s.left = cubie.stickers.up;

    return {
      ...cubie,
      position: [-y, x, z],
      stickers: s,
    };
  });
}

export function moveBPrime(state) {
  return state.map((cubie) => {
    const [x, y, z] = cubie.position;

    if (z !== -1) return cubie;

    const s = { ...cubie.stickers };

    s.up = cubie.stickers.left;
    s.left = cubie.stickers.down;
    s.down = cubie.stickers.right;
    s.right = cubie.stickers.up;

    return {
      ...cubie,
      position: [y, -x, z],
      stickers: s,
    };
  });
}

export function generateScramble(length = 25) {

  const moves = [
    "R", "R'",
    "U", "U'",
    "L", "L'",
    "F", "F'",
    "D", "D'",
    "B", "B'"
  ];

  let scramble = [];
  let previousMove = "";

  for (let i = 0; i < length; i++) {

    let move;

    do {
      move =
        moves[
          Math.floor(
            Math.random() * moves.length
          )
        ];

    } while (
      move[0] === previousMove[0]
    );

    scramble.push(move);
    previousMove = move;
  }

  return scramble;
}

export const moveMap = {
  "R": moveR,
  "R'": moveRPrime,

  "U": moveU,
  "U'": moveUPrime,

  "L": moveL,
  "L'": moveLPrime,

  "F": moveF,
  "F'": moveFPrime,

  "D": moveD,
  "D'": moveDPrime,

  "B": moveB,
  "B'": moveBPrime,
};

export const inverseMoveMap = {
  "R": "R'",
  "R'": "R",

  "U": "U'",
  "U'": "U",

  "L": "L'",
  "L'": "L",

  "F": "F'",
  "F'": "F",

  "D": "D'",
  "D'": "D",

  "B": "B'",
  "B'": "B",
};

export function applyMove(state, move) {
  return moveMap[move](state);
}