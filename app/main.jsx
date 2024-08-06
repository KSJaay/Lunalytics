// import styles
import './styles/styles.scss';
import 'react-toastify/dist/ReactToastify.css';

// import dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// import local files
import Login from './pages/login';
import Register from './pages/register';
import Navigation from './components/navigation';
import Home from './pages/home';
import Monitor from './pages/monitor';
import GlobalLayout from './layout/global';
import Setttings from './pages/settings';
import Verify from './pages/verify';
import ErrorPage from './pages/error';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer position="top-right" theme="dark" />
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <GlobalLayout>
              <Navigation>
                <Home />
              </Navigation>
            </GlobalLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <GlobalLayout>
              <Setttings />
            </GlobalLayout>
          }
        />
        <Route
          path="/monitor/:monitor_id"
          element={
            <GlobalLayout>
              <Navigation activeUrl="monitor">
                <Monitor />
              </Navigation>
            </GlobalLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/404" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
