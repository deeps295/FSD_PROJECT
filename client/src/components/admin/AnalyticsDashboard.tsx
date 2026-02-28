import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import PendingIcon from '@mui/icons-material/Pending';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface KPI {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const AnalyticsDashboard: React.FC = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [onLeave, setOnLeave] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);

  const fetch = async () => {
    try {
      const empRes = await axios.get('/api/employees');
      setTotalEmployees(empRes.data.length);

      const attRes = await axios.get('/api/attendance');
      const today = new Date().toISOString().split('T')[0];
      setPresentToday(attRes.data.filter((a: any) => a.date === today).length);

      const leaveRes = await axios.get('/api/leaves');
      setOnLeave(leaveRes.data.filter((l: any) => l.status === 'approved').length);
      setPendingLeaves(leaveRes.data.filter((l: any) => l.status === 'pending').length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const kpis: KPI[] = [
    { label: 'Total Employees', value: totalEmployees, icon: <PeopleIcon />, color: '#1E3A8A' },
    { label: 'Present Today', value: presentToday, icon: <CheckCircleIcon />, color: '#10B981' },
    { label: 'On Leave', value: onLeave, icon: <EventBusyIcon />, color: '#EF4444' },
    { label: 'Pending Leaves', value: pendingLeaves, icon: <PendingIcon />, color: '#F97316' },
  ];

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Present',
        data: [65, 70, 68, 72, 75, 60, 55],
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        borderRadius: 8,
      },
      {
        label: 'Absent',
        data: [15, 10, 12, 8, 5, 20, 25],
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { family: 'Inter, sans-serif', size: 12, weight: 600 },
          color: '#374151',
          padding: 15,
        },
      },
      title: {
        display: true,
        text: 'Weekly Attendance Trend',
        font: { family: 'Poppins, sans-serif', size: 16, weight: 600 },
        color: '#1E3A8A',
        padding: 20,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#F3F4F6', drawBorder: false },
        ticks: { font: { family: 'Inter, sans-serif', size: 12 }, color: '#6B7280' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter, sans-serif', size: 12 }, color: '#6B7280' },
      },
    },
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Analytics Dashboard
      </Typography>

      {/* KPI Cards Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {kpis.map((kpi, idx) => (
          <Box key={idx} sx={{ flex: '1 1 250px' }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
                borderLeft: `4px solid ${kpi.color}`,
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography sx={{ color: '#6B7280', fontSize: 12, fontWeight: 500, mb: 1 }}>
                      {kpi.label}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
                      {kpi.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: kpi.color, opacity: 0.7, fontSize: 32 }}>
                    {kpi.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Chart Card */}
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          p: 3,
          backgroundColor: '#FFFFFF',
        }}
      >
        <Box sx={{ height: 300 }}>
          <Bar data={chartData} options={chartOptions as any} />
        </Box>
      </Card>
    </Box>
  );
};

export default AnalyticsDashboard;
