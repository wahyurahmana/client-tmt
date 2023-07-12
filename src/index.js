import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorPage from './pages/errorPage';
import SignUpPage from './pages/signupPage';
import SignInPage from './pages/signInPage';
import Dashboard from './pages/dashboardPage';
import ToolTab from './components/toolsTab';
import ActivityTab from './components/activitiesTab';
import FormTool from './components/formTool';
import FormEditTool from './components/formEditTool';
import FormActivity from './components/formActivity';
import ChangePassword from './components/changePassword';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
    children : [
      {
        index: true,
        path: 'tools',
        element : <ToolTab />
      }, {
        index: true,
        path: 'tools/:toolId',
        element : <FormEditTool />
      }, {
        path: 'activities',
        element : <ActivityTab />
      }, {
        path: 'form-tool',
        element : <FormTool />
      }, {
        path: 'form-activity',
        element : <FormActivity />
      }, {
        path: 'change-password',
        element : <ChangePassword />
      },
    ],
    errorElement: <ErrorPage />,
  },{
    path: 'register',
    element: <SignUpPage />
  },{
    path: 'login',
    element: <SignInPage />
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
