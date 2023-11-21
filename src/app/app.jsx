// import node_modules
import { useParams } from 'react-router-dom';

// import local files
import Auth from './auth';
import Login from './pages/login';
import Register from './pages/register';
import Navigation from './components/navigation';
import Home from './pages/home';

const routes = {
  test: (params) => <div>Route exists</div>,
};

function App() {
  const query = useParams();
  const [page, ...params] = query['*']?.toLowerCase().split('/');

  if (!page) {
    return (
      <Auth>
        <Navigation>
          <Home />
        </Navigation>
      </Auth>
    );
  }

  if (page === 'login') {
    return <Login />;
  }

  if (page === 'register') {
    return <Register />;
  }

  const routeExists = routes[page];

  if (routeExists) {
    return (
      <Auth>
        <Navigation>{routeExists(params)}</Navigation>
      </Auth>
    );
  }
}

export default App;
