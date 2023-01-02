import React from 'react';
import {
    Routes,
    Route,
} from "react-router-dom";
import Signup from './components/SignUp'
import SignIn from './components/SignInSide'
import Dashboard from './components/Dashboard'
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthProvider';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>} />
                <Route path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
