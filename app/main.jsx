// import styles
import './styles/styles.scss';
import 'react-toastify/dist/ReactToastify.css';

// import dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { GlobalProvider } from '@lunalytics/ui';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import local files
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import GlobalLayout from './layout/global';
import Setttings from './pages/settings';
import Verify from './pages/verify';
import ErrorPage from './pages/error';
import Notifications from './pages/notifications';
import Setup from './pages/setup';
import StatusConfigure from './pages/status-page';
import StatusLayout from './layout/status';
import StatusPage from './pages/status';
import Incidents from './pages/incidents';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer position="top-right" theme="dark" />
    <GlobalProvider>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <StatusLayout>
                <StatusPage id="default" />
              </StatusLayout>
            }
          />
          <Route
            path="/status/:statusPageId"
            element={
              <StatusLayout>
                <StatusPage />
              </StatusLayout>
            }
          />
          <Route
            path="/home"
            element={
              <GlobalLayout>
                <Home />
              </GlobalLayout>
            }
          />
          <Route
            path="/notifications"
            element={
              <GlobalLayout>
                <Notifications />
              </GlobalLayout>
            }
          />
          <Route
            path="/status-pages"
            element={
              <GlobalLayout>
                <StatusConfigure />
              </GlobalLayout>
            }
          />
          <Route
            path="/incidents"
            element={
              <GlobalLayout>
                <Incidents />
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/404" element={<ErrorPage />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  </React.StrictMode>
);
