import './style.scss';

// import dependencies
import { useMemo } from 'react';

// import local files
import StatusPageHeaderStatus from './status';
import StatusPageHeaderTitle from './title';

const StatusPageHeader = ({
  title = {},
  status = {},
  homepageUrl = '/',
  logo = '/logo.svg',
  titleText = 'Lunalytics',
}) => {
  const orders = useMemo(() => {
    const positions = [];
    if (title.showLogo || title.showTitle) {
      positions.push(title.position);
    }

    if (status.showStatus || status.showTitle) {
      positions.push(status.position);
    }

    if (positions.length < 1) {
      return null;
    }

    if (positions.length === 1) {
      if (positions[0] === 'Left') {
        return [1, 2];
      } else if (positions[0] === 'Center') {
        return [0, 2];
      } else if (positions[0] === 'Right') {
        return [0, 1];
      }
    }

    if (!positions.includes('Left')) {
      return [0];
    } else if (!positions.includes('Center')) {
      return [1];
    } else if (!positions.includes('Right')) {
      return [2];
    }
  }, [title, status]);

  if (!orders) return null;

  return (
    <div className="status-page-header-container">
      <StatusPageHeaderTitle
        homepageUrl={homepageUrl}
        title={title}
        logo={logo}
        titleText={titleText}
      />
      <StatusPageHeaderStatus status={status} />

      {orders.map((order, index) => (
        <div key={index} style={{ order: order }}></div>
      ))}
    </div>
  );
};

StatusPageHeader.displayName = 'StatusPageHeader';

export default StatusPageHeader;
