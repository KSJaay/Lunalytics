const Spacer = ({ size = 0 }: { size: number }) => (
  <div style={{ height: `${size}px`, color: '#ffffff00', userSelect: 'none' }}>
    Hidden text
  </div>
);

export default Spacer;
