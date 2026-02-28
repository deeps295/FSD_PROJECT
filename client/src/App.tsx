import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

// employee subcomponents
import Profile from './components/employee/Profile';
import Attendance from './components/employee/Attendance';
import LeaveRequest from './components/employee/LeaveRequest';

// admin subcomponents
import EmployeeList from './components/admin/EmployeeList';
import AttendanceView from './components/admin/AttendanceView';
import LeaveRequests from './components/admin/LeaveRequests';
import AnalyticsDashboard from './components/admin/AnalyticsDashboard';

function AppRoutes() {
  const { token, role } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin/*"
        element={token && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
      >
        <Route path="employees" element={<EmployeeList />} />
        <Route path="attendance" element={<AttendanceView />} />
        <Route path="leaves" element={<LeaveRequests />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
      </Route>
      <Route
        path="/employee/*"
        element={token && role === 'employee' ? <EmployeeDashboard /> : <Navigate to="/login" />}
      >
        <Route path="profile" element={<Profile />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="leave" element={<LeaveRequest />} />
      </Route>
      <Route path="*" element={<Navigate to={token ? (role === 'admin' ? '/admin' : '/employee') : '/login'} />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
