import { Employee, Attendance, LeaveRequest } from './types';

// In-memory store (resets on function invocation)
// For production, use a database like MongoDB
let employees: Employee[] = [];
let attendance: Attendance[] = [];
let leaves: LeaveRequest[] = [];

// Initialize with sample data
function initializeSampleData() {
  if (employees.length > 0) return; // Already initialized

  // Sample admin user
  const adminPasswordHash = '$2a$10$K7L3Y8K2J1H5Q9X2M8L1D.uM1G2R3S4T5U6V7W8X9Y0Z1A2B3C4D5'; // "admin123" hashed
  employees.push({
    id: 1,
    fullName: 'Admin User',
    email: 'admin@example.com',
    phone: '9876543210',
    department: 'Management',
    role: 'admin',
    dateOfJoining: new Date().toISOString().split('T')[0],
    status: 'active',
    passwordHash: adminPasswordHash,
  });
}

export const store = {
  getEmployees: () => {
    initializeSampleData();
    return employees;
  },
  findEmployeeByEmail: (email: string) => {
    initializeSampleData();
    return employees.find(e => e.email === email);
  },
  findEmployeeById: (id: number) => {
    initializeSampleData();
    return employees.find(e => e.id === id);
  },
  createEmployee: (emp: Employee) => {
    initializeSampleData();
    employees.push(emp);
    return emp;
  },
  updateEmployee: (id: number, updates: Partial<Employee>) => {
    initializeSampleData();
    const emp = employees.find(e => e.id === id);
    if (emp) Object.assign(emp, updates);
    return emp;
  },
  deleteEmployee: (id: number) => {
    initializeSampleData();
    employees = employees.filter(e => e.id !== id);
    attendance = attendance.filter(a => a.employeeId !== id);
    leaves = leaves.filter(l => l.employeeId !== id);
  },

  // Attendance
  getAttendance: () => {
    initializeSampleData();
    return attendance;
  },
  getEmployeeAttendance: (employeeId: number) => {
    initializeSampleData();
    return attendance.filter(a => a.employeeId === employeeId);
  },
  findAttendanceByEmployeeAndDate: (employeeId: number, date: string) => {
    initializeSampleData();
    return attendance.find(a => a.employeeId === employeeId && a.date === date);
  },
  createOrUpdateAttendance: (entry: Attendance) => {
    initializeSampleData();
    const existing = attendance.find(a => a.id === entry.id);
    if (existing) {
      Object.assign(existing, entry);
    } else {
      attendance.push(entry);
    }
    return entry;
  },

  // Leaves
  getLeaves: () => {
    initializeSampleData();
    return leaves;
  },
  getEmployeeLeaves: (employeeId: number) => {
    initializeSampleData();
    return leaves.filter(l => l.employeeId === employeeId);
  },
  findLeaveById: (id: number) => {
    initializeSampleData();
    return leaves.find(l => l.id === id);
  },
  createLeave: (leave: LeaveRequest) => {
    initializeSampleData();
    leaves.push(leave);
    return leave;
  },
  updateLeave: (id: number, updates: Partial<LeaveRequest>) => {
    initializeSampleData();
    const leave = leaves.find(l => l.id === id);
    if (leave) Object.assign(leave, updates);
    return leave;
  },

  // Reset for testing
  reset: () => {
    employees = [];
    attendance = [];
    leaves = [];
  },
};
