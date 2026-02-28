### Installation

1. **Navigate to project**
   ```bash
   cd EMPLOYEE
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   npm run build
   npm run dev          # starts on http://localhost:5000
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   npm start            # starts on http://localhost:3000
   ```
# Employee Attendance & Leave Management System

A comprehensive web-based platform for managing employee attendance, leave requests, and organizational analytics with role-based access control.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Material UI
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL
- **Authentication:** JWT + bcryptjs
- **Charting:** Chart.js + React Chart

## Features

### Authentication
- **Register** with full name, email, and password
- **Secure Login** with JWT token-based sessions
- **Password Encryption** using bcryptjs
- **Session Management** with localStorage token persistence
- Role-based route protection (Admin/Employee)

### Admin Dashboard

#### Employee Management
- View all employees with detailed information
- Add new employees with role assignment
- Edit employee details
- Manage employee status (Active/Inactive)

**Employee Data Fields:**
- Employee ID
- Full Name
- Email
- Phone Number
- Address
- Date of Joining
- Role (Admin / Employee)
- Department 
- Status (Active / Inactive)

#### Attendance Monitoring
- View employee punch-in/out records
- Monitor daily, weekly, and monthly attendance
- Identify missing punch-outs
- Track late entries & early exits

**Attendance Fields:**
- Employee ID
- Date
- Punch In Time
- Punch Out Time
- Total Working Hours
- Status (Present / Absent / Half Day)

#### Leave & Permission Management
- View all leave/permission requests
- Approve or reject with admin remarks
- Track leave types and dates

**Leave Fields:**
- Employee ID
- Leave Type (Full Day / Half Day / Permission)
- Reason for leave
- From & To Dates
- Status (Pending / Approved / Rejected)
- Admin Remarks

#### Analytics Dashboard
- Total employee count
- Today's attendance overview
- Employees on leave
- Pending leave requests
- Monthly attendance trends (chart)

### Employee Dashboard
- View personal profile
- Track personal attendance records
- Request leave or permission
- Check leave status and admin remarks

## API Endpoints

All endpoints require JWT authentication (except `/auth/login` and `/auth/register`).

### Authentication
- `POST /api/auth/register` – Register new employee
- `POST /api/auth/login` – Login with email & password

### Employees (Admin only)
- `GET /api/employees` – List all employees
- `POST /api/employees` – Add new employee
- `PUT /api/employees/:id` – Update employee

### Attendance
- `GET /api/attendance` – Get attendance records
- `POST /api/attendance/punch` – Punch in/out

### Leave Requests
- `GET /api/leaves` – Get all leave requests
- `POST /api/leaves` – Request leave/permission
- `PUT /api/leaves/:id/approve` – Approve leave (Admin)
- `PUT /api/leaves/:id/reject` – Reject leave (Admin)

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn



## UI Components

### Material UI Features
- Beautiful responsive design with AppBar and Drawer navigation
- Data Tables with Material UI styling
- Form inputs with validation
- Paper cards for data display
- Grid layout for dashboard metrics
- Chart.js integration for attendance trends

### Pages
- **Login Page** – Email/password login with validation
- **Register Page** – New user registration
- **Admin Dashboard** – Navigation drawer with 4 sections:
  - Employees: View/manage all employee records
  - Attendance: Monitor punch records
  - Leave Requests: Approve/reject with remarks
  - Analytics: Dashboard with KPIs and charts
- **Employee Dashboard** – Navigation with 3 sections:
  - Profile: View personal information
  - Attendance: Track personal attendance
  - Leave Request: Submit leave/permission requests

## Key Implementation Details

- **JWT Authentication:** Tokens stored in localStorage, auto-set in axios headers
- **Role-Based Routes:** Protected routes redirect unauthorized users to login
- **Password Hashing:** bcryptjs for secure password storage
- **Type Safety:** Full TypeScript types for components and API responses
- **API Proxy:** Frontend proxies `/api` calls to backend on port 5000

## Troubleshooting

**Port already in use:**
- Backend: Set `PORT=3001` in .env
- Frontend: Kill port 3000 or modify CRA config

**API not connecting:**
- Check backend is running on port 5000
- Verify proxy in client/package.json

**Login fails:**
- Ensure backend server is running
- Check browser console for CORS errors

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Email notifications
- [ ] Bulk user import via CSV
- [ ] Advanced reports and exports
- [ ] Multi-language support
- [ ] Two-factor authentication
- [ ] Geographic punch tracking
- [ ] Mobile app (React Native)
- [ ] Holiday calendar
- [ ] Shift management

---

**Version:** 1.0.0  
**Last Updated:** Feb 27, 2026  
**Status:** Beta (In-Memory Storage)
