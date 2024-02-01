// import dependencies
import { useParams } from 'react-router-dom';

// import local files
import Login from './pages/login';
import Register from './pages/register';
import Navigation from './components/navigation';
import Home from './pages/home';
import MonitorRouter from './routes/monitor';
import GlobalLayout from './layout/global';
import Setttings from './pages/settings';
import Verify from './pages/verify';

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

  if (page === 'verify') {
    return <Verify />;
  }

  if (!page) {
    return (
      <GlobalLayout>
        <Navigation>
          <Home />
        </Navigation>
      </GlobalLayout>
    );
  }

  if (page === 'settings') {
    return (
      <GlobalLayout>
        <Navigation activeUrl="settings">
          <Setttings />
        </Navigation>
      </GlobalLayout>
    );
  }

  const routeExists = routes[page];

  if (routeExists) {
    return (
      <GlobalLayout>
        <Navigation activeUrl="monitor">{routeExists(params)}</Navigation>
      </GlobalLayout>
    );
  }
};

export default App;
