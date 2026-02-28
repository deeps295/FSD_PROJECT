import { Handler } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import { store } from '../src/lib/store';
import { extractToken, verifyToken } from '../src/lib/auth';
import { Employee } from '../src/lib/types';

const handler: Handler = async (event) => {
  try {
    const token = extractToken(event.headers.authorization);
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const user = verifyToken(token);
    if (!user || user.role !== 'admin') {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden - Admin access required' }),
      };
    }

    if (event.httpMethod === 'GET') {
      const employees = store.getEmployees();
      const response = employees.map(({ passwordHash, ...rest }) => rest);
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }

    if (event.httpMethod === 'POST') {
      const { fullName, email, password, phone, department, role, address, status } =
        JSON.parse(event.body || '{}');

      if (store.findEmployeeByEmail(email)) {
        return {
          statusCode: 409,
          body: JSON.stringify({ message: 'Email already exists' }),
        };
      }

      const passwordHash = await bcrypt.hash(password || 'password', 10);
      const employees = store.getEmployees();
      const newEmployee: Employee = {
        id: (Math.max(...employees.map(e => e.id), 0) || 0) + 1,
        fullName,
        email,
        phone: phone || '',
        address,
        dateOfJoining: new Date().toISOString().split('T')[0],
        role: role === 'admin' ? 'admin' : 'employee',
        department,
        status: status === 'inactive' ? 'inactive' : 'active',
        passwordHash,
      };

      store.createEmployee(newEmployee);
      const { passwordHash: _, ...response } = newEmployee;

      return {
        statusCode: 201,
        body: JSON.stringify(response),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export { handler };
