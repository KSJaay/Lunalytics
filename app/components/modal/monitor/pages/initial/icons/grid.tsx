// import dependencies
import PropTypes from 'prop-types';
import { FixedSizeGrid as Grid } from 'react-window';

const MonitorIconGrid = ({ icons, handleInput }) => {
  if (!icons) return null;

  return (
    <Grid
      columnCount={5}
      columnWidth={100}
      height={350}
      rowCount={Math.ceil(icons.length / 5)}
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
        const item = icons[rowIndex * 6 + columnIndex];
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

MonitorIconGrid.propTypes = {
  inputs: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleInput: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
};

export default MonitorIconGrid;
