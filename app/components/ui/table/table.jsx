import PropTypes from 'prop-types';

const Table = ({ children }) => {
  return (
    <div className="table-container">
      <table>{children}</table>
    </div>
  );
};

Table.propTypes = {
  children: PropTypes.node,
};

Table.displayName = 'TableTable';

export default Table;
