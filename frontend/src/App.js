import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Fields from './pages/Fields';
import Crops from './pages/Crops';
import Productions from './pages/Productions';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Activities from './pages/Activities';

const protectedPage = (component, allowedRoles) => (
  <ProtectedRoute allowedRoles={allowedRoles}>{component}</ProtectedRoute>
);

function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={protectedPage(<Dashboard />)} />
          <Route path="/fields" element={protectedPage(<Fields />, [1, 2, 3, 4, 5])} />
          <Route path="/crops" element={protectedPage(<Crops />, [1, 2, 3, 4])} />
          <Route path="/productions" element={protectedPage(<Productions />, [1, 2, 3, 4, 5])} />
          <Route path="/expenses" element={protectedPage(<Expenses />, [1, 2, 4])} />
          <Route path="/reports" element={protectedPage(<Reports />, [1, 2, 3, 4])} />
          <Route path="/notifications" element={protectedPage(<Notifications />, [1, 2, 3, 4, 5])} />
          <Route path="/activities" element={protectedPage(<Activities />, [1, 2, 3, 4, 5])} />
          <Route path="/register" element={protectedPage(<Register />, [1, 4])} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
