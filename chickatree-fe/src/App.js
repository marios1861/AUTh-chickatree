import React from 'react';
import
{
  Navigate,
  createBrowserRouter
} from "react-router-dom";
import SignUp from './components/SignUp';
import SignIn from './components/SignInSide';
import Dashboard, { MainDashboard } from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthProvider';
import apiClient from './apis/config';

const router = createBrowserRouter([
  {
    element: <AuthProvider apiClient={apiClient} />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" />
      },
      {
        path: "/dashboard/*",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>),
        children: [
          {
            index: true,
            element: <MainDashboard />,
          }
        ]
      },
      {
        path: "/login",

        element: <SignIn />
      },
      {
        path: "/signup",
        element: <SignUp />
      }
    ]
  }
]);

export default router;