import './styles.scss';

// import dependencies
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

// import local files
import Button from '../../ui/button';

// import icons
import FaPlus from '../../icons/faPlus';
import FaReload from '../../icons/faReload';
import MenuLayoutDropdown from './layout';
import MenuStatusDropdown from './status';
import SearchBar from '../../ui/searchBar';
import { useNavigate } from 'react-router-dom';
import useContextStore from '../../../context';

const HomeMenu = ({ handleReset, search, setSearch }) => {
  const navigate = useNavigate();
  const {
    userStore: { user },
  } = useContextStore();

  return (
    <div className="home-menu">
      <SearchBar onChange={setSearch} value={search} placeholder="Search..." />

      <div className="home-menu-buttons">
        <Button
          iconLeft={<FaReload width={20} height={20} />}
          onClick={handleReset}
        />

        <MenuStatusDropdown />
        <MenuLayoutDropdown />

        {user.canEdit ? (
          <Button
            onClick={() => navigate('/monitor/add')}
            iconLeft={<FaPlus width={20} height={20} />}
            color={'primary'}
          >
            New
          </Button>
        ) : null}
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

export default observer(HomeMenu);
