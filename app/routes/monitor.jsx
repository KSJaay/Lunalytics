// import dependencies
import PropTypes from 'prop-types';

// import local files
import Monitor from '../pages/monitor';

const MonitorRouter = ({ params }) => {
  const [pageId] = params;

  return <Monitor monitorId={pageId} />;
};

MonitorRouter.displayName = 'MonitorRouter';

MonitorRouter.propTypes = {
  params: PropTypes.array.isRequired,
};

export default MonitorRouter;
