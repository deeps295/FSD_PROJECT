import { Handler } from '@netlify/functions';
import { store } from '../lib/store';
import { extractToken, verifyToken } from '../lib/auth';

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

    const id = parseInt(event.path?.split('/').pop() || '0', 10);

    if (event.httpMethod === 'PUT') {
      const updates = JSON.parse(event.body || '{}');
      const employee = store.updateEmployee(id, updates);

      if (!employee) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Employee not found' }),
        };
      }

      const { passwordHash, ...response } = employee;

      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }

    if (event.httpMethod === 'DELETE') {
      const employee = store.findEmployeeById(id);
      if (!employee) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Employee not found' }),
        };
      }

      store.deleteEmployee(id);

      return {
        statusCode: 204,
        body: '',
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
