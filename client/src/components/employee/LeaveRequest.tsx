import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
} from '@mui/material';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface LeaveRecord {
  id: number;
  employeeId: number;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
  adminRemarks?: string;
}

const LeaveRequest: React.FC = () => {
  const [type, setType] = useState('Full Day');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const fetchLeaves = async () => {
    try {
      const res = await axios.get('/api/leaves');
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!fromDate || !toDate || !reason) {
      setError('Please fill all fields');
      return;
    }

    try {
      await axios.post('/api/leaves', { leaveType: type, fromDate, toDate, reason });
      setSuccess(true);
      setType('Full Day');
      setFromDate('');
      setToDate('');
      setReason('');
      fetchLeaves();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to submit leave request');
    }
  };

  const getStatusChip = (status: string) => {
    const config: any = {
      'pending': { label: 'Pending', color: 'warning', icon: <AccessTimeIcon /> },
      'approved': { label: 'Approved', color: 'success', icon: <CheckCircleIcon /> },
      'rejected': { label: 'Rejected', color: 'error', icon: <CancelIcon /> },
    };
    const cfg = config[status] || config['pending'];
    return <Chip label={cfg.label} color={cfg.color} variant="filled" icon={cfg.icon} size="small" />;
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Leave Requests
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Form */}
        <Box sx={{ flex: '1 1 400px' }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1F2937' }}>
                New Leave Request
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Leave request submitted successfully!
                </Alert>
              )}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  select
                  label="Leave Type"
                  SelectProps={{ native: true }}
                  value={type}
                  onChange={e => setType(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  <option value="Full Day">Full Day</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Permission">Permission</option>
                </TextField>

                <TextField
                  label="From"
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="To"
                  type="date"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  label="Reason"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mb: 2.5 }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{ backgroundColor: '#1E3A8A', '&:hover': { backgroundColor: '#1E40AF' } }}
                >
                  Submit Request
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Leave History */}
        <Box sx={{ flex: '1 1 500px' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: 600 }}>From</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>To</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaves.length > 0 ? (
                  leaves.map(leave => (
                    <TableRow key={leave.id} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                      <TableCell sx={{ fontWeight: 500 }}>{leave.fromDate}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{leave.toDate}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{leave.leaveType}</TableCell>
                      <TableCell align="center">{getStatusChip(leave.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#9CA3AF' }}>
                      No leave requests yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default LeaveRequest;
