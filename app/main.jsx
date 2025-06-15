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
import Notifications from './pages/notifications';
import Setup from './pages/setup';
import Status from './pages/status-pages';
import StatusConfigure from './pages/status-pages/configure';
import StatusLayout from './layout/status';
import StatusPage from './pages/status';
import Incidents from './pages/incidents';
import IncidentUpdate from './pages/incidents/id';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastContainer position="top-right" theme="dark" />
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <StatusLayout>
              <StatusPage id={'default'} />
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
              <Navigation>
                <Home />
              </Navigation>
            </GlobalLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <GlobalLayout>
              <Navigation activeUrl="/notifications">
                <Notifications />
              </Navigation>
            </GlobalLayout>
          }
        />
        <Route
          path="/status-pages"
          element={
            <GlobalLayout>
              <Navigation activeUrl="/status-pages">
                <Status />
              </Navigation>
            </GlobalLayout>
          }
        />
        <Route
          path="/status-pages/configure"
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
              <Navigation activeUrl="/incidents">
                <Incidents />
              </Navigation>
            </GlobalLayout>
          }
        />
        <Route
          path="/incidents/:incidentId"
          element={
            <GlobalLayout>
              <Navigation activeUrl="/incidents">
                <IncidentUpdate />
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
              <Navigation>
                <Monitor />
              </Navigation>
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
  </React.StrictMode>
);
