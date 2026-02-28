import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

// types
interface Employee {
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

interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  punchIn?: string;
  punchOut?: string;
  totalHours?: number;
  status: 'Present' | 'Absent' | 'Half Day';
}

interface LeaveRequest {
  id: number;
  employeeId: number;
  leaveType: 'Full Day' | 'Half Day' | 'Permission';
  reason?: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected';
  adminRemarks?: string;
}

// in-memory stores
let employees: Employee[] = [];
let attendance: Attendance[] = [];
let leaves: LeaveRequest[] = [];

// helpers
const jwtSecret = process.env.JWT_SECRET || 'secret';

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
}

function authorizeRole(role: 'admin' | 'employee') {
  return (req: Request, res: Response, next: NextFunction) => {
    const user: any = (req as any).user;
    if (user && user.role === role) next();
    else res.status(403).send('Forbidden');
  };
}

// auth
router.post('/auth/register', async (req: Request, res: Response) => {
  const { fullName, email, password, phone, department, role } = req.body;
  if (!email || !password || !fullName || !phone || !department) {
    return res.status(400).json({ message: 'missing required fields' });
  }
  if (employees.find(e => e.email === email)) {
    return res.status(409).json({ message: 'email already exists' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const emp: Employee = {
    id: employees.length + 1,
    fullName,
    email,
    phone,
    department,
    role: (role === 'admin' ? 'admin' : 'employee') as 'admin' | 'employee',
    dateOfJoining: new Date().toISOString().split('T')[0],
    status: 'active',
    passwordHash,
  };
  employees.push(emp);
  res.status(201).json({ id: emp.id, email: emp.email, role: emp.role });
});

router.post('/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = employees.find(e => e.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, jwtSecret, { expiresIn: '1h' });
  res.json({ token, role: user.role, email: user.email });
});

// get current user profile
router.get('/auth/me', authenticateToken, (req: Request, res: Response) => {
  const user: any = (req as any).user;
  const emp = employees.find(e => e.id === user.id);
  if (!emp) return res.status(404).json({ message: 'User not found' });
  const { passwordHash, ...profile } = emp;
  res.json(profile);
});

// employees (admin)
router.get('/employees', authenticateToken, authorizeRole('admin'), (req: Request, res: Response) => {
  res.json(employees.map(({ passwordHash, ...rest }) => rest));
});

router.post('/employees', authenticateToken, authorizeRole('admin'), async (req: Request, res: Response) => {
  const { fullName, email, password, role } = req.body;
  if (employees.find(e => e.email === email)) {
    return res.status(409).json({ message: 'email already exists' });
  }
  const passwordHash = await bcrypt.hash(password || 'password', 10);
  const emp: Employee = {
    id: employees.length + 1,
    fullName,
    email,
    phone: req.body.phone || '',
    address: req.body.address,
    dateOfJoining: req.body.dateOfJoining,
    role: role === 'admin' ? 'admin' : 'employee',
    department: req.body.department,
    status: req.body.status === 'inactive' ? 'inactive' : 'active',
    passwordHash,
  };
  employees.push(emp);
  res.status(201).json({ id: emp.id, email: emp.email });
});

router.put('/employees/:id', authenticateToken, authorizeRole('admin'), (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const emp = employees.find(e => e.id === id);
  if (!emp) return res.status(404).send('Not found');
  Object.assign(emp, req.body);
  res.json(emp);
});

// allow admin to remove employee
router.delete('/employees/:id', authenticateToken, authorizeRole('admin'), (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const idx = employees.findIndex(e => e.id === id);
  if (idx === -1) return res.status(404).send('Not found');
  employees.splice(idx, 1);
  // remove related attendance and leaves
  attendance = attendance.filter(a => a.employeeId !== id);
  leaves = leaves.filter(l => l.employeeId !== id);
  res.sendStatus(204);
});

// attendance
router.get('/attendance', authenticateToken, (req: Request, res: Response) => {
  const userId = (req as any).user?.id as number;
  const userRole = (req as any).user?.role as string;
  if (userRole === 'admin') {
    return res.json(attendance);
  }
  // only return records for the logged-in employee
  const filtered = attendance.filter(a => a.employeeId === userId);
  res.json(filtered);
});

router.post('/attendance/punch', authenticateToken, (req: Request, res: Response) => {
  // ensure we always record the employee from the token rather than trust the client
  const userId = (req as any).user?.id as number;
  const { date, punchIn, punchOut } = req.body;

  if (!date) return res.status(400).send('Date is required');

  // look for an existing record for this user and day
  let entry = attendance.find(a => a.employeeId === userId && a.date === date);

  if (!entry) {
    // create new entry
    entry = {
      id: attendance.length + 1,
      employeeId: userId,
      date,
      punchIn,
      punchOut,
      status: 'Present',
    } as Attendance;
    attendance.push(entry);
    return res.status(201).json(entry);
  }

  // update existing record, with validation to prevent multiple punch in/out
  if (punchIn) {
    if (entry.punchIn) {
      return res.status(400).send('Already punched in for today');
    }
    entry.punchIn = punchIn;
  }
  if (punchOut) {
    if (entry.punchOut) {
      return res.status(400).send('Already punched out for today');
    }
    entry.punchOut = punchOut;
  }

  return res.json(entry);
});

// leaves
router.get('/leaves', authenticateToken, (req: Request, res: Response) => {
  const userId = (req as any).user?.id as number;
  const userRole = (req as any).user?.role as string;
  if (userRole === 'admin') {
    return res.json(leaves);
  }
  const filtered = leaves.filter(l => l.employeeId === userId);
  res.json(filtered);
});

router.post('/leaves', authenticateToken, (req: Request, res: Response) => {
  const userId = (req as any).user?.id as number;
  const { leaveType, reason, fromDate, toDate } = req.body;
  if (!leaveType || !fromDate || !toDate) {
    return res.status(400).send('Missing required fields');
  }
  const leave: LeaveRequest = {
    id: leaves.length + 1,
    employeeId: userId,
    leaveType,
    reason,
    fromDate,
    toDate,
    status: 'pending',
  };
  leaves.push(leave);
  res.status(201).json(leave);
});

router.put('/leaves/:id/approve', authenticateToken, authorizeRole('admin'), (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const l = leaves.find(x => x.id === id);
  if (l) {
    l.status = 'approved';
    if (req.body.adminRemarks) l.adminRemarks = req.body.adminRemarks;
    res.json(l);
  } else {
    res.status(404).send('Not found');
  }
});

router.put('/leaves/:id/reject', authenticateToken, authorizeRole('admin'), (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  const l = leaves.find(x => x.id === id);
  if (l) {
    l.status = 'rejected';
    if (req.body.adminRemarks) l.adminRemarks = req.body.adminRemarks;
    res.json(l);
  } else {
    res.status(404).send('Not found');
  }
});

export default router;
