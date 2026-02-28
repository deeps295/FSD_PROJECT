import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, CssBaseline, Box, Button } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const drawerWidth = 240;

const AdminDashboard: React.FC = () => {
  const { logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem component={NavLink} to="/admin/employees" sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f0f0f0' } }}>
              <ListItemText primary="Employees" />
            </ListItem>
            <ListItem component={NavLink} to="/admin/attendance" sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f0f0f0' } }}>
              <ListItemText primary="Attendance" />
            </ListItem>
            <ListItem component={NavLink} to="/admin/leaves" sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f0f0f0' } }}>
              <ListItemText primary="Leave Requests" />
            </ListItem>
            <ListItem component={NavLink} to="/admin/analytics" sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f0f0f0' } }}>
              <ListItemText primary="Analytics" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
