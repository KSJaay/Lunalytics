// import local files
import Monitor from '../pages/monitor';
import AddMonitor from '../pages/monitor/add';
import EditMonitor from '../pages/monitor/edit';

const MonitorRouter = ({ params }) => {
  const [pageId] = params;

  if (pageId === 'add') {
    return <AddMonitor />;
  }

  if (pageId === 'edit') {
    return <EditMonitor />;
  }

  return <Monitor monitorId={pageId} />;
};

export default MonitorRouter;
