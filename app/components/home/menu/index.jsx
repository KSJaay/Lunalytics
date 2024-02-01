import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import Button from '../../ui/button';

// import icons
import FaPlus from '../../icons/faPlus';
import FaReload from '../../icons/faReload';
import MenuLayoutDropdown from './layout';
import MenuStatusDropdown from './status';
import SearchBar from '../../ui/searchBar';
import { useNavigate } from 'react-router-dom';

const HomeMenu = ({ handleReset, search, setSearch }) => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        margin: '10px 10px 0px 10px',
      }}
    >
      <SearchBar onChange={setSearch} value={search} placeholder="Search..." />

      <div style={{ display: 'flex', gap: '10px' }}>
        <Button
          iconLeft={<FaReload width={20} height={20} />}
          onClick={handleReset}
        />
        <MenuStatusDropdown />

        <MenuLayoutDropdown />

        <Button
          onClick={() => navigate('/monitor/add')}
          iconLeft={<FaPlus width={20} height={20} />}
          color={'primary'}
        >
          New
        </Button>
      </div>
    </div>
  );
};

HomeMenu.displayName = 'HomeMenu';

HomeMenu.propTypes = {
  handleReset: PropTypes.func,
  search: PropTypes.string,
  setSearch: PropTypes.func,
};

export default HomeMenu;
