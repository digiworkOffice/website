import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Contracts from './components/Contracts';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RequireAuth } from './utils/RequireAuth';
import { AuthProvider } from './utils/authContext';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import NewContract from './components/NewContract';
import Wallet from './components/Wallet';
import Profile from './components/ProfilePage';
import Settings from './components/SettingsPage';
import EditContract from './components/EditContract';
import AdminLogin from './components/AdminLogin'; 
import { RequireAdminAuth } from './utils/RequireAdminAuth';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/HomePage';


function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path='/dashboard' element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path='/contracts' element={<RequireAuth><Contracts /></RequireAuth>} />
          <Route path='/contracts/new' element={<RequireAuth><NewContract /></RequireAuth>} />
          <Route path='/contracts/edit/:id' element={<RequireAuth><EditContract /></RequireAuth>} />
          <Route path = '/wallet' element = { <RequireAuth><Wallet /></RequireAuth>} />
          <Route path='/profile' element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path='/settings' element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<RequireAdminAuth><AdminDashboard /></RequireAdminAuth>} /> 
        </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
