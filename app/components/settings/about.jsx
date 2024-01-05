import './about.scss';

const SetttingAbout = () => {
  const version = import.meta.env.VITE_REACT_APP_VERSION;

  return (
    <div className="settings-about-container">
      <img src="/logo.svg" className="settings-about-logo" />
      <div className="settings-about-title">Lunalytics</div>
      <div className="settings-about-version">Version {version}</div>
      <div>
        <a
          href="https://github.com/KSJaay/lunalytics"
          target="_blank"
          rel="noreferrer"
          className="settings-about-link"
        >
          Help us develop/create new features for Lunalytics
        </a>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default SetttingAbout;
