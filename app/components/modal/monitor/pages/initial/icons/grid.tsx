// import dependencies
import { FixedSizeGrid as Grid } from 'react-window';

const limit = 5;

type GridProps = {
  customIcons: { u: string; n: string; id: string; f?: string }[];
  icons: { u: string; n: string; id: string; f?: string }[];
  handleInput: (key: string, value: any) => void;
};

type GridItemProps = {
  item: { type: string; u: string; n: string; id: string; f?: string };
  handleInput: (key: string, value: any) => void;
  style: React.CSSProperties;
};

const GridItem = ({ item, style, handleInput }: GridItemProps) => {
  if (item?.type === 'custom') {
    return (
      <div
        className="monitor-select-icon"
        style={style}
        key={item.id}
        onClick={() =>
          handleInput('icon', {
            id: item.id,
            name: item.n,
            url: item.u,
          })
        }
      >
        <img
          src={item.u}
          alt={item.n}
          style={{ width: '40px', height: '40px' }}
          className="monitor-select-icon"
        />
        <div style={{ textAlign: 'center' }}>{item.n}</div>
      </div>
    );
  }

  if (item?.type === 'selfh.st') {
    return (
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
    );
  }

  return null;
};

const MonitorIconGrid = ({ customIcons, icons, handleInput }: GridProps) => {
  if (!icons) return null;

  const iconsSize = icons.length + customIcons.length;
  const allIcons = [
    ...customIcons.map((icon) => ({ ...icon, type: 'custom' })),
    ...icons.map((icon) => ({ ...icon, type: 'selfh.st' })),
  ];

  return (
    <Grid
      columnCount={limit}
      columnWidth={100}
      height={350}
      rowCount={Math.ceil(iconsSize / limit)}
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
        const item = allIcons[rowIndex * limit + columnIndex];
        return <GridItem item={item} style={style} handleInput={handleInput} />;
      }}
    </Grid>
  );
};

MonitorIconGrid.displayName = 'MonitorIconGrid';

export default MonitorIconGrid;
