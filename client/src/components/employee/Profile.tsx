import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import axios from 'axios';

interface ProfileData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  dateOfJoining: string;
  status: string;
}

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        setProfileData(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Your Profile
        </Typography>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Your Profile
        </Typography>
        <Typography color="error">Failed to load profile</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Your Profile
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Profile Card */}
        <Box sx={{ flex: '1 1 400px' }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    backgroundColor: '#1E3A8A',
                    borderRadius: '50%',
                    padding: 2,
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <PersonIcon sx={{ color: 'white', fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1F2937' }}>
                    {profileData.fullName}
                  </Typography>
                  <Chip
                    label={profileData.status === 'active' ? 'Active' : 'Inactive'}
                    color={profileData.status === 'active' ? 'success' : 'default'}
                    variant="filled"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>

              {/* Profile Details */}
              <Box sx={{ space: 2 }}>
                <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ color: '#1E3A8A', mr: 1.5 }} />
                  <Box>
                    <Typography sx={{ color: '#6B7280', fontSize: 12, fontWeight: 500 }}>
                      Email
                    </Typography>
                    <Typography sx={{ color: '#374151', fontWeight: 500 }}>
                      {profileData.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ color: '#1E3A8A', mr: 1.5 }} />
                  <Box>
                    <Typography sx={{ color: '#6B7280', fontSize: 12, fontWeight: 500 }}>
                      Phone
                    </Typography>
                    <Typography sx={{ color: '#374151', fontWeight: 500 }}>
                      {profileData.phone}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'center' }}>
                  <BadgeIcon sx={{ color: '#1E3A8A', mr: 1.5 }} />
                  <Box>
                    <Typography sx={{ color: '#6B7280', fontSize: 12, fontWeight: 500 }}>
                      Department
                    </Typography>
                    <Typography sx={{ color: '#374151', fontWeight: 500 }}>
                      {profileData.department}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Employment Details */}
        <Box sx={{ flex: '1 1 400px' }}>
          <Card
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5, color: '#1F2937' }}>
                Employment Details
              </Typography>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ color: '#6B7280', fontSize: 12, fontWeight: 500, mb: 0.5 }}>
                  Role
                </Typography>
                <Chip
                  label={profileData.role === 'admin' ? 'Admin' : 'Employee'}
                  color={profileData.role === 'admin' ? 'primary' : 'default'}
                  variant="filled"
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ color: '#6B7280', fontSize: 12, fontWeight: 500, mb: 0.5 }}>
                  Date of Joining
                </Typography>
                <Typography sx={{ color: '#374151', fontWeight: 500 }}>
                  {profileData.dateOfJoining}
                </Typography>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography sx={{ color: '#6B7280', fontSize: 12, fontWeight: 500, mb: 0.5 }}>
                  Status
                </Typography>
                <Chip
                  label={profileData.status === 'active' ? 'Active' : 'Inactive'}
                  color={profileData.status === 'active' ? 'success' : 'default'}
                  variant="filled"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
