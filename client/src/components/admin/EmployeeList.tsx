import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, 
  Box, Chip, Typography, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BadgeIcon from '@mui/icons-material/Badge';

interface Emp {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  status: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Emp[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'employee', phone: '', department: '' });

  const fetch = async () => {
    try {
      const res = await axios.get('/api/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this employee?')) return;
    try {
      await axios.delete(`/api/employees/${id}`);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleAddEmployee = async () => {
    try {
      await axios.post('/api/employees', formData);
      setFormData({ fullName: '', email: '', password: '', role: 'employee', phone: '', department: '' });
      setOpen(false);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleChip = (role: string) => (
    <Chip 
      label={role === 'admin' ? 'Admin' : 'Employee'}
      icon={role === 'admin' ? <AdminPanelSettingsIcon /> : <BadgeIcon />}
      color={role === 'admin' ? 'primary' : 'default'}
      variant="filled"
      size="small"
    />
  );

  const getStatusChip = (status: string) => (
    <Chip 
      label={status === 'active' ? 'Active' : 'Inactive'}
      color={status === 'active' ? 'success' : 'default'}
      variant="outlined"
      size="small"
    />
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Employees
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<PersonAddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Employee
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Employee</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Department"
            value={formData.department}
            onChange={e => setFormData({ ...formData, department: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Role"
            value={formData.role}
            onChange={e => setFormData({ ...formData, role: e.target.value })}
            margin="normal"
            SelectProps={{ native: true }}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddEmployee} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Dept</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(emp => (
              <TableRow key={emp.id} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                <TableCell sx={{ fontWeight: 500 }}>{emp.id}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{emp.fullName}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.phone}</TableCell>
                <TableCell>{getRoleChip(emp.role)}</TableCell>
                <TableCell>{emp.department || '-'}</TableCell>
                <TableCell>{getStatusChip(emp.status)}</TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(emp.id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeList;
