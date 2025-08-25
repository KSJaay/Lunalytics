// import dependencies
import { FixedSizeGrid as Grid } from 'react-window';

const limit = 5;

const MonitorIconGrid = ({
  icons,
  handleInput,
}: {
  icons: { u: string; n: string; f: string }[];
  handleInput: (key: string, value: any) => void;
}) => {
  if (!icons) return null;

  return (
    <Grid
      columnCount={limit}
      columnWidth={100}
      height={350}
      rowCount={Math.ceil(icons.length / limit)}
      rowHeight={100}
      width={500}
      style={{ overflowX: 'hidden', marginTop: '20px', gap: '10px' }}
    >
      {({
        columnIndex,
        rowIndex,
        style,
      }: {
        columnIndex: number;
        rowIndex: number;
        style: React.CSSProperties;
      }) => {
        const item = icons[rowIndex * limit + columnIndex];
        return item ? (
          <div
            className="monitor-select-icon"
            style={style}
            key={item.u}
            onClick={() =>
              handleInput('icon', {
                id: item.u,
                name: item.n,
                url: `https://cdn.jsdelivr.net/gh/selfhst/icons/${item.f}/${item.u}.${item.f}`,
              })
            }
          >
            <img
              src={`https://cdn.jsdelivr.net/gh/selfhst/icons/${item.f}/${item.u}.${item.f}`}
              alt={item.n}
              style={{ width: '40px', height: '40px' }}
              className="monitor-select-icon"
            />
            <div style={{ textAlign: 'center' }}>{item.n}</div>
          </div>
        ) : null;
      }}
    </Grid>
  );
};

MonitorIconGrid.displayName = 'MonitorIconGrid';

export default MonitorIconGrid;
