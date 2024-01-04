// import local files
import TopNavigation from './top';
import LeftNavigation from './left';

// import styles
import './index.scss';

const Navigation = ({ children, activeUrl = '/' }) => {
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

export default Navigation;
