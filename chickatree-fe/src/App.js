import React from 'react';
import {
Navigate,
createBrowserRouter
} from "react-router-dom";
import SignUp from './components/SignUp';
import SignIn from './components/SignInSide';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthProvider';
import Profile from './components/Dashboard/Profile';
import Tree from './components/Dashboard/Tree';
import apiClient from './apis/config';

const router = createBrowserRouter([
  {
    element: <AuthProvider apiClient={ apiClient } />,
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
            element: <Tree />,
          },
          {
            path: "profile",
            element: <Profile />
          },
          {
            path: "trees",
            element: <Tree />
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