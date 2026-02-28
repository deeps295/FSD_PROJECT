import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Card, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      const role = localStorage.getItem('role');
      if (role === 'admin') navigate('/admin');
      else navigate('/employee');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
      <Container maxWidth="xs">
        <Card sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" sx={{ color: '#1E3A8A', mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Sign in to your account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
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
              sx={{ mb: 2 }}
            >
              Sign In
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #E5E7EB' }}>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#1E3A8A', textDecoration: 'none', fontWeight: 600 }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
