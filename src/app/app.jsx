// import node_modules
import { useParams } from 'react-router-dom';

// import local files
import Login from './pages/login';
import Register from './pages/register';
import Navigation from './components/navigation';
import Home from './pages/home';
import MonitorRouter from './routes/monitor';

const routes = {
  monitor: (params) => <MonitorRouter params={params} />,
};

function App() {
  const query = useParams();
  const [page, ...params] = query['*']?.toLowerCase().split('/');

  if (page === 'login') {
    return <Login />;
  }

  if (page === 'register') {
    return <Register />;
  }

  if (!page) {
    return (
      <Navigation>
        <Home />
      </Navigation>
    );
  }

  const routeExists = routes[page];

  if (routeExists) {
    return <Navigation>{routeExists(params)}</Navigation>;
  }
}

export default App;
