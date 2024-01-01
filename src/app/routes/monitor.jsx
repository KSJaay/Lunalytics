// import local files
import AddMonitor from '../pages/monitor/add';
import EditMonitor from '../pages/monitor/edit';

const MonitorRouter = ({ params }) => {
  const [page] = params;

  if (page === 'add') {
    return <AddMonitor />;
  }

  if (page === 'edit') {
    return <EditMonitor />;
  }

  // redirect to 404
};

export default MonitorRouter;
