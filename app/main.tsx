// import styles
import './styles/styles.scss';
import 'react-toastify/dist/ReactToastify.css';
import './services/i18n';

// import dependencies
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { GlobalProvider } from '@lunalytics/ui';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// import local files
import Loading from './components/ui/loading';

const Home = React.lazy(() => import('./pages/home'));
const Settings = React.lazy(() => import('./pages/settings'));
const Notifications = React.lazy(() => import('./pages/notifications'));
const StatusConfigure = React.lazy(() => import('./pages/status-page'));
const StatusPage = React.lazy(() => import('./pages/status'));
const Incidents = React.lazy(() => import('./pages/incidents'));
const GlobalLayout = React.lazy(() => import('./layout/global'));
const Login = React.lazy(() => import('./pages/login'));
const Register = React.lazy(() => import('./pages/register'));
const Setup = React.lazy(() => import('./pages/setup'));
const Verify = React.lazy(() => import('./pages/verify'));
const ErrorPage = React.lazy(() => import('./pages/error'));
const StatusLayout = React.lazy(() => import('./layout/status'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense fallback={<Loading />}>
      <ToastContainer position="top-right" theme="dark" closeOnClick stacked />
      <GlobalProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <React.Suspense fallback={<Loading />}>
                  <StatusLayout>
                    <StatusPage id="default" />
                  </StatusLayout>
                </React.Suspense>
              }
            />
            <Route
              path="/status/:statusPageId"
              element={
                <React.Suspense fallback={<Loading />}>
                  <StatusLayout>
                    <StatusPage />
                  </StatusLayout>
                </React.Suspense>
              }
            />
            <Route
              path="/home"
              element={
                <React.Suspense fallback={<Loading />}>
                  <GlobalLayout>
                    <Home />
                  </GlobalLayout>
                </React.Suspense>
              }
            />
            <Route
              path="/notifications"
              element={
                <React.Suspense fallback={<Loading />}>
                  <GlobalLayout>
                    <Notifications />
                  </GlobalLayout>
                </React.Suspense>
              }
            />
            <Route
              path="/status-pages"
              element={
                <React.Suspense fallback={<Loading />}>
                  <GlobalLayout>
                    <StatusConfigure />
                  </GlobalLayout>
                </React.Suspense>
              }
            />
            <Route
              path="/incidents"
              element={
                <React.Suspense fallback={<Loading />}>
                  <GlobalLayout>
                    <Incidents />
                  </GlobalLayout>
                </React.Suspense>
              }
            />
            <Route
              path="/settings"
              element={
                <React.Suspense fallback={<Loading />}>
                  <GlobalLayout>
                    <Settings />
                  </GlobalLayout>
                </React.Suspense>
              }
            />
            <Route
              path="/login"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Login />
                </React.Suspense>
              }
            />
            <Route
              path="/register"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Register />
                </React.Suspense>
              }
            />
            <Route
              path="/setup"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Setup />
                </React.Suspense>
              }
            />
            <Route
              path="/verify"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Verify />
                </React.Suspense>
              }
            />
            <Route
              path="/error"
              element={
                <React.Suspense fallback={<Loading />}>
                  <ErrorPage />
                </React.Suspense>
              }
            />
            <Route
              path="/404"
              element={
                <React.Suspense fallback={<Loading />}>
                  <ErrorPage />
                </React.Suspense>
              }
            />
            <Route
              path="/*"
              element={
                <React.Suspense fallback={<Loading />}>
                  <ErrorPage />
                </React.Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </GlobalProvider>
    </React.Suspense>
  </React.StrictMode>
);
