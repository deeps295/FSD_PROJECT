# SETUP GUIDE

## Quick Start

### 1. Backend Setup
```powershell
cd server
npm install
cp .env.example .env      # Create environment file
npm run dev               # Start backend on port 5000
```

### 2. Frontend Setup (new terminal)
```powershell
cd client
npm install
npm start                 # Start frontend on port 3000
```

### 3. Access the Application
- Open browser: http://localhost:3000
- Register a new account OR
- Use admin account for testing

## Test Credentials (first user created becomes available)

1. Register as admin user
2. Admin email/password will enable all admin features
3. Additional users register as employees

## Architecture Overview

### Frontend (React + TypeScript + Material UI)
- **AuthContext:** Global auth state management
- **Protected Routes:** Admin/Employee specific pages
- **Components:** Modular UI with MUI styling
- **API Client:** Axios with JWT auto-headers

### Backend (Express + TypeScript)
- **Middleware:** JWT verification on protected routes
- **Auth Routes:** Register/Login with password hashing
- **Admin Routes:** Protected by role-based middleware
- **In-Memory Storage:** Arrays for employees, attendance, leaves

## Key Features Implemented

✅ Secure Registration & Login
✅ Password Encryption (bcryptjs)
✅ JWT Token Management
✅ Role-Based Route Protection
✅ Admin Dashboard with Multiple Sections
✅ Employee Management (CRUD)
✅ Attendance Tracking
✅ Leave Request Management
✅ Admin Approval/Rejection Workflow
✅ Beautiful Material UI Design
✅ Analytics Dashboard with Charts
✅ Employee Self-Service Portal

## Database (Currently In-Memory)

To use a real database:

1. Install database driver (MongoDB/PostgreSQL)
2. Replace in-memory arrays with database queries
3. Update routes to use async/await with DB

Example for MongoDB:
```typescript
npm install mongoose
```

## File Organization Reference

**Admin Components:**
- EmployeeList.tsx – Table of all employees
- AttendanceView.tsx – Attendance records display
- LeaveRequests.tsx – Leave approval interface
- AnalyticsDashboard.tsx – KPI cards + charts

**Employee Components:**
- Profile.tsx – User profile view
- Attendance.tsx – Personal attendance history
- LeaveRequest.tsx – Leave request form

## API Testing

Use Postman or curl to test endpoints:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Get employees (requires JWT token)
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Styling Notes

- Material UI handles all theming
- Responsive design works on mobile/tablet/desktop
- Dark mode support can be added via ThemeProvider
- Custom colors configurable in theme settings

## Next Steps for Production

1. Add Database (MongoDB/PostgreSQL)
2. Add form validation (react-hook-form + yup)
3. Add error handling & toast notifications
4. Add file upload (Excel for bulk import)
5. Add email notifications
6. Add two-factor authentication
7. Add audit logging
8. Deploy to cloud (Vercel/Netlify for frontend, Heroku/Railway for backend)
9. Add HTTPS and environment-based config
10. Add rate limiting and security headers

---

For any issues or questions, refer to the main README.md file.
