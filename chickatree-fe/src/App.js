import React from 'react';
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Signup from './components/SignUp'
import SignIn from './components/SignInSide'
import Dashboard, { MainDashboard } from './components/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/"
          element={
            <Navigate to="/dashboard" />} />
        <Route path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}>
          <Route index element={<MainDashboard />} />
        </Route>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
