// import dependencies
import classNames from 'classnames';

const StatusPageHeaderTitle = ({
  homepageUrl,
  title = {},
  logo = '/logo.svg',
  titleText = 'Lunalytics',
}) => {
  if (!title.showLogo && !title.showTitle) {
    return null;
  }

  const containerClasses = classNames('spht-logo-container', {
    [title.rotation]: true,
    [title.alignment]: true,
    [`position-${title.position}`]: true,
  });

  const logoClasses = classNames('spht-logo-image', {
    [title.logoSize]: title.showLogo,
  });

  const titleClasses = classNames('spht-logo-title', {
    [title.titleSize]: title.showTitle,
  });

  return (
    <a className={containerClasses} href={homepageUrl}>
      {title.showLogo && <img src={logo} alt="logo" className={logoClasses} />}
      {title.showTitle && <div className={titleClasses}>{titleText}</div>}
    </a>
  );
};

StatusPageHeaderTitle.displayName = 'StatusPageHeaderTitle';

export default StatusPageHeaderTitle;
