const PillCircle = ({
  size = 300,
  pillWidth = 40,
  pillHeight = 12,
  pills = [],
}) => {
  const radius = size / 2;

  const count = pills.length;

  if (!count) return null;

  return (
    <div
      className="pill-circle"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {pills.map((color, i) => {
        const angleDeg = (360 / count) * i;
        const angleRad = (angleDeg * Math.PI) / 180;

        const x = radius + Math.cos(angleRad) * (radius - pillWidth / 2);
        const y = radius + Math.sin(angleRad) * (radius - pillWidth / 2);

        return (
          <div
            key={color + i}
            className="pill"
            style={{
              width: `${pillWidth}px`,
              height: `${pillHeight}px`,
              backgroundColor: color,
              left: `${x - pillWidth / 2}px`,
              top: `${y - pillHeight / 2}px`,
              transform: `rotate(${angleDeg}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

export default PillCircle;
