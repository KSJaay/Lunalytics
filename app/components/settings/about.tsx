import './about.scss';

const SetttingAbout = () => {
  // eslint-disable-next-line no-undef
  const version = __APP_VERSION__ || '0.6.0';

  return (
    <div className="settings-about-container">
      <img src="/logo.svg" style={{ width: '250px' }} />

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
