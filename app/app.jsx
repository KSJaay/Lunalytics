// import node_modules
import { useParams } from 'react-router-dom';

// import local files
import Login from './pages/login';
import Register from './pages/register';
import Navigation from './components/navigation';
import Home from './pages/home';
import MonitorRouter from './routes/monitor';
import MonitorsLayout from './layout/monitors';
import Setttings from './pages/settings';

const routes = {
  monitor: (params) => <MonitorRouter params={params} />,
};

const App = () => {
  const query = useParams();
  const [page, ...params] = query['*']?.toLowerCase().split('/') || [];

  if (page === 'login') {
    return <Login />;
  }

  if (page === 'register') {
    return <Register />;
  }

  if (!page) {
    return (
      <MonitorsLayout>
        <Navigation>
          <Home />
        </Navigation>
      </MonitorsLayout>
    );
  }

  if (page === 'settings') {
    return (
      <MonitorsLayout>
        <Navigation activeUrl="settings">
          <Setttings />
        </Navigation>
      </MonitorsLayout>
    );
  }

  const routeExists = routes[page];

  if (routeExists) {
    return (
      <MonitorsLayout>
        <Navigation>{routeExists(params)}</Navigation>
      </MonitorsLayout>
    );
  }
};

export default App;
