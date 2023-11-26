// import local files
import AddMinitor from '../pages/monitor/add';

const MonitorRouter = ({ params }) => {
  const [page, ...rest] = params;

  if (page === 'add') {
    return <AddMinitor />;
  }

  if (page === 'edit') {
    return <EditMonitor />;
  }

  // redirect to 404
};

export default MonitorRouter;
