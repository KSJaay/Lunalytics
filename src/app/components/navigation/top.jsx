// import styles
import './top.scss';

const TopNavigation = () => {
  return (
    <div className="top-navigation">
      <div className="top-navigation-logo-container">
        <img src="/logo.svg" className="top-navigation-logo" />
        <div className="top-navigation-logo-text">Uptime Lunar</div>
      </div>
      <div className="top-navigation-right-container">
        <div className="top-navigation-right-username">KSJaay</div>
      </div>
    </div>
  );
};

export default TopNavigation;
