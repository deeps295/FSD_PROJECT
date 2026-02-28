import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreTimeIcon from '@mui/icons-material/MoreTime';

interface AttendanceRecord {
  id: number;
  employeeId: number;
  date: string;
  punchIn?: string;
  punchOut?: string;
  totalHours?: number;
  status: string;
}

const Attendance: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get('/api/attendance');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const [message, setMessage] = useState<string | null>(null);

  const punchIn = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      // check local copy before sending
      const existing = records.find(r => r.date === today);
      if (existing && existing.punchIn) {
        setMessage('You have already punched in today.');
        return;
      }
      const time = new Date().toLocaleTimeString();
      await axios.post('/api/attendance/punch', { date: today, punchIn: time });
      fetchAttendance();
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data) {
        setMessage(err.response.data);
      }
    }
  };

  const punchOut = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const existing = records.find(r => r.date === today);
      if (existing && existing.punchOut) {
        setMessage('You have already punched out today.');
        return;
      }
      if (!existing || !existing.punchIn) {
        setMessage('Please punch in before punching out.');
        return;
      }
      const time = new Date().toLocaleTimeString();
      await axios.post('/api/attendance/punch', { date: today, punchOut: time });
      fetchAttendance();
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.data) {
        setMessage(err.response.data);
      }
    }
  };

  const getStatusChip = (status: string) => {
    const config: any = {
      'Present': { label: 'Present', color: 'success', icon: <CheckCircleIcon /> },
      'Absent': { label: 'Absent', color: 'error', icon: <CancelIcon /> },
      'Half Day': { label: 'Half Day', color: 'warning', icon: <AccessTimeIcon /> },
    };
    const cfg = config[status] || config['Present'];
    return <Chip label={cfg.label} color={cfg.color} variant="filled" icon={cfg.icon} size="small" />;
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Your Attendance
      </Typography>

      {message && (
        <Alert
          severity="info"
          onClose={() => setMessage(null)}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      {/* Quick Actions */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' } }}
          onClick={punchIn}
          disabled={(() => {
            const today = new Date().toISOString().split('T')[0];
            const r = records.find(r => r.date === today);
            return !!(r && r.punchIn);
          })()}
        >
          Punch In
        </Button>
        <Button
          variant="outlined"
          onClick={punchOut}
          sx={{ borderColor: '#1E3A8A', color: '#1E3A8A' }}
          disabled={(() => {
            const today = new Date().toISOString().split('T')[0];
            const r = records.find(r => r.date === today);
            return !r || !!r.punchOut || !r.punchIn;
          })()}
        >
          Punch Out
        </Button>
      </Box>

      {/* Attendance Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Punch In
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Punch Out
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Hours
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length > 0 ? (
              records.map(record => (
                <TableRow key={record.id} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{record.date}</TableCell>
                  <TableCell align="center">{record.punchIn || '-'}</TableCell>
                  <TableCell align="center">{record.punchOut || '-'}</TableCell>
                  <TableCell align="center">
                    {record.totalHours ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <MoreTimeIcon sx={{ fontSize: 16, color: '#1E3A8A' }} />
                        {record.totalHours}h
                      </Box>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="center">{getStatusChip(record.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: '#9CA3AF' }}>
                  No attendance records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Attendance;
