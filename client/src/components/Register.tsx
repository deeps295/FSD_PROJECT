import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Card, Alert, MenuItem } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName || !email || !password || !phone || !department || !role) {
      setError('All fields are required');
      return;
    }
    try {
      await register({ fullName, email, password, phone, department, role });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: 2,
    }}>
      <Container maxWidth="sm">
        <Card sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ color: '#1E3A8A', mb: 1, fontWeight: 700 }}>
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Join our employee management system
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Department"
              value={department}
              onChange={e => setDepartment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              margin="normal"
              required
              fullWidth
              label="Role"
              value={role}
              onChange={e => setRole(e.target.value)}
              sx={{ mb: 2 }}
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large"
              sx={{ mb: 2, backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#1E40AF' } }}
            >
              Create Account
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #E5E7EB' }}>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1E3A8A', textDecoration: 'none', fontWeight: 600 }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
