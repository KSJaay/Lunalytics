import PropTypes from 'prop-types';

const Container = ({ children }) => {
  return (
    <div className="table-container">
      <table className="responsive-table">{children}</table>
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node,
};

Container.displayName = 'TableContainer';

export default Container;
