// import node_modules
import React from 'react';

// import local files
import Monitor from '../components/home/monitor';
import AddMonitor from '../components/home/add';

// import styles
import './home.scss';

const Home = () => {
  return (
    <div className="home-container">
      <Monitor />
      <AddMonitor />
    </div>
  );
};

export default Home;
