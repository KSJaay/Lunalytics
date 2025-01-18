// import styles
import './index.scss';

// import dependencies
import PropTypes from 'prop-types';

// import local files
import TopNavigation from './top';
import LeftNavigation from './left';

const Navigation = ({ children, activeUrl = '/dashboard' }) => {
  return (
    <div className="navigation-container">
      <TopNavigation />
      <div className="navigation-content">
        <LeftNavigation activeUrl={activeUrl} />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

Navigation.displayName = 'Navigation';

Navigation.propTypes = {
  children: PropTypes.node,
  activeUrl: PropTypes.string,
};

export default Navigation;
