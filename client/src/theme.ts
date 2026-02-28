import { createTheme } from '@mui/material/styles';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1E3A8A', // Deep Blue
      light: '#3B82F6',
      dark: '#1E293B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F3F4F6', // Light Gray
      light: '#F9FAFB',
      dark: '#E5E7EB',
      contrastText: '#1F2937',
    },
    success: {
      main: '#10B981', // Green (Approved)
      light: '#D1FAE5',
      dark: '#059669',
    },
    error: {
      main: '#EF4444', // Red (Rejected)
      light: '#FEE2E2',
      dark: '#DC2626',
    },
    warning: {
      main: '#F97316', // Orange (Pending)
      light: '#FEEDDC',
      dark: '#EA580C',
    },
    info: {
      main: '#0EA5E9',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: '"Inter", "Poppins", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1E3A8A',
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '2rem',
      fontWeight: 700,
      color: '#1E3A8A',
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#1F2937',
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1F2937',
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#1F2937',
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1F2937',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#1F2937',
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#6B7280',
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
      fontSize: '0.9375rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '10px 20px',
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          transition: 'all 0.3s ease',
          fontSize: '0.9375rem',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(30, 58, 138, 0.15)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(30, 58, 138, 0.25)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: '#E5E7EB',
          '&:hover': {
            backgroundColor: '#F9FAFB',
            borderColor: '#1E3A8A',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#3B82F6',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1E3A8A',
              boxShadow: '0 0 0 3px rgba(30, 58, 138, 0.1)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderColor: '#D1D5DB',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
        },
        elevation0: {
          boxShadow: 'none',
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#1F2937',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid #E5E7EB',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#F9FAFB',
            fontWeight: 600,
            color: '#1F2937',
            borderColor: '#E5E7EB',
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          },
          '& .MuiTableBody-root .MuiTableRow-root': {
            '&:hover': {
              backgroundColor: '#F9FAFB',
            },
          },
          '& .MuiTableCell-body': {
            borderColor: '#E5E7EB',
            padding: '16px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E5E7EB',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.active': {
            backgroundColor: '#EFF6FF',
            borderLeft: '4px solid #1E3A8A',
            '& .MuiListItemText-primary': {
              fontWeight: 600,
              color: '#1E3A8A',
            },
          },
          '&:hover': {
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filled: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
