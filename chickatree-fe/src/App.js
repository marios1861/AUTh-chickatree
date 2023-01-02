import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink
} from "react-router-dom";
import Link from '@mui/material/Link';
import SignIn from './components/SignInSide.js'
import Dashboard from './components/Dashboard.js'
import logo from './logo.svg';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<SignIn />} />
    </Routes>
  );
}

export default App;
