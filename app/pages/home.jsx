// import local files
import { Monitor } from '../components/home/monitor';
import AddMonitor from '../components/home/add';

// import styles
import './home.scss';
import { observer } from 'mobx-react-lite';
import useContextStore from '../context';

const Home = () => {
  const {
    globalStore: { getAllMonitors },
  } = useContextStore();

  const monitors = getAllMonitors();

  const monitorsList = monitors.map((monitor) => (
    <Monitor key={monitor.monitorId} monitor={monitor} />
  ));

  return (
    <div className="home-container">
      {monitorsList}
      <AddMonitor />
    </div>
  );
};

Home.displayName = 'Home';

export default observer(Home);
