function Cubie({ position, stickers }) {

  const black = "#111111";

  const materials = [

    <meshStandardMaterial
      key="right"
      attach="material-0"
      color={stickers.right || black}
    />,

    <meshStandardMaterial
      key="left"
      attach="material-1"
      color={stickers.left || black}
    />,

    <meshStandardMaterial
      key="top"
      attach="material-2"
      color={stickers.up || black}
    />,

    <meshStandardMaterial
      key="bottom"
      attach="material-3"
      color={stickers.down || black}
    />,

    <meshStandardMaterial
      key="front"
      attach="material-4"
      color={stickers.front || black}
    />,

    <meshStandardMaterial
      key="back"
      attach="material-5"
      color={stickers.back || black}
    />
  ];

  return (
    <mesh position={position}>
      <boxGeometry args={[0.88, 0.88, 0.88]} />
      {materials}
    </mesh>
  );
}

export default Cubie;