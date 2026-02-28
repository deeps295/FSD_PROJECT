import { Handler } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import { store } from '../src/lib/store';
import { generateToken } from '../src/lib/auth';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { fullName, email, password, phone, department, role } = JSON.parse(
      event.body || '{}'
    );

    if (!email || !password || !fullName || !phone || !department) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    if (store.findEmployeeByEmail(email)) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'Email already exists' }),
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const employees = store.getEmployees();
    const newEmployee = {
      id: (Math.max(...employees.map(e => e.id), 0) || 0) + 1,
      fullName,
      email,
      phone,
      department,
      role: (role === 'admin' ? 'admin' : 'employee') as 'admin' | 'employee',
      dateOfJoining: new Date().toISOString().split('T')[0],
      status: 'active' as const,
      passwordHash,
    };

    store.createEmployee(newEmployee);

    const token = generateToken({
      id: newEmployee.id,
      role: newEmployee.role,
      email: newEmployee.email,
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        token,
        id: newEmployee.id,
        email: newEmployee.email,
        role: newEmployee.role,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export { handler };
