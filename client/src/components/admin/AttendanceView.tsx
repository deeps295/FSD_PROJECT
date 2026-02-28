import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Box, Typography, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';

interface Entry {
  id: number;
  employeeId: number;
  date: string;
  punchIn?: string;
  punchOut?: string;
  totalHours?: number;
  status: string;
}

const AttendanceView: React.FC = () => {
  const [data, setData] = useState<Entry[]>([]);
  const [employeesMap, setEmployeesMap] = useState<Record<number,string>>({});
  const [missingPunchOuts, setMissingPunchOuts] = useState<number>(0);
  const [lateEntries, setLateEntries] = useState<number>(0);

  const fetch = async () => {
    try {
      const [attRes, empRes] = await Promise.all([
        axios.get('/api/attendance'),
        axios.get('/api/employees'),
      ]);
      setData(attRes.data);

      // build map of id -> fullName
      const map: Record<number,string> = {};
      empRes.data.forEach((e: any) => {
        map[e.id] = e.fullName || `${e.email}`;
      });
      setEmployeesMap(map);
      
      // Calculate missing punch-outs (punch-in but no punch-out)
      const missing = attRes.data.filter((a: Entry) => a.punchIn && !a.punchOut).length;
      setMissingPunchOuts(missing);
      
      // Calculate late entries (punch-in after 09:00)
      const late = attRes.data.filter((a: Entry) => {
        if (!a.punchIn) return false;
        const [hours, minutes] = a.punchIn.split(':').map(Number);
        return hours > 9 || (hours === 9 && minutes > 0);
      }).length;
      setLateEntries(late);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const getStatusChip = (status: string) => {
    const config: any = {
      'Present': { label: 'Present', color: 'success', icon: <CheckCircleIcon /> },
      'Absent': { label: 'Absent', color: 'error', icon: <CancelIcon /> },
      'Half Day': { label: 'Half Day', color: 'warning', icon: <AccessTimeIcon /> },
    };
    const cfg = config[status] || config['Present'];
    return <Chip label={cfg.label} color={cfg.color} variant="filled" icon={cfg.icon} size="small" />;
  };

  const isMissingPunchOut = (entry: Entry) => entry.punchIn && !entry.punchOut;

  const isLateEntry = (entry: Entry) => {
    if (!entry.punchIn) return false;
    const [hours, minutes] = entry.punchIn.split(':').map(Number);
    return hours > 9 || (hours === 9 && minutes > 0);
  };

  const isEarlyExit = (entry: Entry) => {
    if (!entry.punchOut) return false;
    const [hours, minutes] = entry.punchOut.split(':').map(Number);
    return hours < 17 || (hours === 17 && minutes < 0);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Attendance Records
      </Typography>

      {/* Summary Alerts */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        {missingPunchOuts > 0 && (
          <Alert severity="warning" icon={<WarningIcon />} sx={{ flex: 1, minWidth: 250 }}>
            <strong>{missingPunchOuts}</strong> employee(s) with missing punch-out today
          </Alert>
        )}
        {lateEntries > 0 && (
          <Alert severity="info" sx={{ flex: 1, minWidth: 250 }}>
            <strong>{lateEntries}</strong> late entries detected
          </Alert>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Punch In</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Punch Out</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Hours</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Issues</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map(e => (
                <TableRow key={e.id} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{e.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {employeesMap[e.employeeId] || e.employeeId}
                  </TableCell>
                  <TableCell>{e.date}</TableCell>
                  <TableCell align="center">{e.punchIn || '-'}</TableCell>
                  <TableCell align="center" sx={{ backgroundColor: isMissingPunchOut(e) ? '#FEE2E2' : 'transparent' }}>
                    {e.punchOut || (isMissingPunchOut(e) ? '✕ Missing' : '-')}
                  </TableCell>
                  <TableCell align="center">{e.totalHours ? `${e.totalHours}h` : '-'}</TableCell>
                  <TableCell align="center">{getStatusChip(e.status)}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      {isMissingPunchOut(e) && (
                        <Chip
                          label="Missing Punch-Out"
                          size="small"
                          icon={<WarningIcon />}
                          sx={{ backgroundColor: '#FEE2E2', color: '#991B1B', fontSize: '10px' }}
                        />
                      )}
                      {isLateEntry(e) && (
                        <Chip
                          label="Late Entry"
                          size="small"
                          sx={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '10px' }}
                        />
                      )}
                      {isEarlyExit(e) && (
                        <Chip
                          label="Early Exit"
                          size="small"
                          sx={{ backgroundColor: '#DBEAFE', color: '#0C2340', fontSize: '10px' }}
                        />
                      )}
                      {!isMissingPunchOut(e) && !isLateEntry(e) && !isEarlyExit(e) && (
                        <Typography sx={{ fontSize: '12px', color: '#6B7280' }}>-</Typography>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#9CA3AF' }}>
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

export default AttendanceView;
