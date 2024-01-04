import './about.scss';

const SetttingAbout = () => {
  const version = import.meta.env.VITE_REACT_APP_VERSION;

  return (
    <div className="settings-about-container">
      <img src="/logo.svg" className="settings-about-logo" />
      <div className="settings-about-title">Uptime Lunar</div>
      <div className="settings-about-version">Version {version}</div>
      <div>
        <a
          href="https://github.com/KSJaay/uptime-lunar"
          target="_blank"
          rel="noreferrer"
          className="settings-about-link"
        >
          Help us keep developing/creating new features for Lunar
        </a>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default SetttingAbout;
