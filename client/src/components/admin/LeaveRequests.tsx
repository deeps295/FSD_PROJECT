import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  Button, TextField, Box, Chip, Typography, Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface LR {
  id: number;
  employeeId: number;
  leaveType: string;
  reason?: string;
  fromDate: string;
  toDate: string;
  status: string;
  adminRemarks?: string;
}

const LeaveRequests: React.FC = () => {
  const [data, setData] = useState<LR[]>([]);
  const [employeesMap, setEmployeesMap] = useState<Record<number,string>>({});
  const [remarks, setRemarks] = useState<{ [key: number]: string }>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetch = async () => {
    try {
      const [leaveRes, empRes] = await Promise.all([
        axios.get('/api/leaves'),
        axios.get('/api/employees'),
      ]);
      setData(leaveRes.data);
      const map: Record<number,string> = {};
      empRes.data.forEach((e: any) => {
        map[e.id] = e.fullName || e.email;
      });
      setEmployeesMap(map);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleOpenDialog = (id: number, action: 'approve' | 'reject') => {
    setSelectedId(id);
    setActionType(action);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedId(null);
    setActionType(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedId || !actionType) return;
    try {
      await axios.put(`/api/leaves/${selectedId}/${actionType === 'approve' ? 'approve' : 'reject'}`, {
        adminRemarks: remarks[selectedId] || '',
      });
      setRemarks(prev => {
        const updated = { ...prev };
        delete updated[selectedId];
        return updated;
      });
      fetch();
      handleCloseDialog();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusChip = (status: string) => {
    const config: any = {
      pending: { label: 'Pending', color: 'warning', icon: <AccessTimeIcon /> },
      approved: { label: 'Approved', color: 'success', icon: <CheckCircleIcon /> },
      rejected: { label: 'Rejected', color: 'error', icon: <CancelIcon /> },
    };
    const cfg = config[status] || config.pending;
    return <Chip label={cfg.label} color={cfg.color} variant="filled" icon={cfg.icon} size="small" />;
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Leave Requests
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>From</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>To</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(l => (
              <TableRow key={l.id} sx={{ '&:hover': { backgroundColor: '#F9FAFB' } }}>
                <TableCell sx={{ fontWeight: 500 }}>{l.id}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>
                  {employeesMap[l.employeeId] || l.employeeId}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{l.leaveType}</TableCell>
                <TableCell>{l.fromDate}</TableCell>
                <TableCell>{l.toDate}</TableCell>
                <TableCell sx={{ fontSize: '12px', color: '#6B7280' }}>{l.reason || '-'}</TableCell>
                <TableCell>{getStatusChip(l.status)}</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {l.status === 'pending' && (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Button 
                        size="small" 
                        variant="contained" 
                        sx={{ backgroundColor: '#10B981', '&:hover': { backgroundColor: '#059669' } }}
                        onClick={() => handleOpenDialog(l.id, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        sx={{ borderColor: '#EF4444', color: '#EF4444' }}
                        onClick={() => handleOpenDialog(l.id, 'reject')}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}
                  {l.status !== 'pending' && (
                    <Box>
                      <Typography sx={{ fontSize: '12px', color: '#6B7280', mb: 0.5 }}>
                        Remarks:
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: '#374151' }}>
                        {l.adminRemarks || 'No remarks'}
                      </Typography>
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Remarks Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {actionType === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={actionType === 'approve' ? 'Approval Remarks (Optional)' : 'Rejection Reason (Required)'}
            value={remarks[selectedId || 0] || ''}
            onChange={e => setRemarks(prev => ({ ...prev, [selectedId || 0]: e.target.value }))}
            placeholder={actionType === 'reject' ? 'Please provide a reason for rejection...' : 'Enter any additional remarks...'}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleConfirmAction} 
            variant="contained" 
            color={actionType === 'approve' ? 'success' : 'error'}
          >
            {actionType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveRequests;
