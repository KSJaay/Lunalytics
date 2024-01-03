// import node_modules
import React, { useContext } from 'react';

// import local files
import Monitor from '../components/home/monitor';
import AddMonitor from '../components/home/add';

// import styles
import './home.scss';
import { observer } from 'mobx-react-lite';
import ContextStore from '../context';

const Home = () => {
  const {
    globalStore: { monitors },
  } = useContext(ContextStore);

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

export default observer(Home);
