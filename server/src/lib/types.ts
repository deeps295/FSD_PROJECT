export interface Employee {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  dateOfJoining?: string;
  role: 'admin' | 'employee';
  department?: string;
  status: 'active' | 'inactive';
  passwordHash: string;
}

export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  punchIn?: string;
  punchOut?: string;
  totalHours?: number;
  status: 'Present' | 'Absent' | 'Half Day';
}

export interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveType: 'Full Day' | 'Half Day' | 'Permission';
  reason?: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
  adminRemarks?: string;
}

export interface AuthUser {
  id: number;
  role: 'admin' | 'employee';
  email: string;
}
