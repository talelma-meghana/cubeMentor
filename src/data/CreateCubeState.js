export function createCubeState() {

  const cubies = [];
  let id = 0;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {

        if (x === 0 && y === 0 && z === 0) continue;

        const stickers = {};

        if (x === 1) stickers.right = "red";
        if (x === -1) stickers.left = "orange";

        if (y === 1) stickers.up = "white";
        if (y === -1) stickers.down = "yellow";

        if (z === 1) stickers.front = "green";
        if (z === -1) stickers.back = "blue";

        cubies.push({
          id: id++,
          position: [x, y, z],
          stickers
        });

      }
    }
  }

  return cubies;
}