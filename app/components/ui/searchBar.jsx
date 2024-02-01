// import styles
import './searchBar.scss';

// import dependencies
import PropTypes from 'prop-types';

const SearchBar = ({ label, id, ...props }) => {
  return (
    <>
      {label && <label className="search-bar-input-label">{label}</label>}
      <input type="text" className="search-bar-input" id={id} {...props} />
    </>
  );
};

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
};

export default SearchBar;
