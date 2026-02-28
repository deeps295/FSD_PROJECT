import { Handler } from '@netlify/functions';
import { store } from '../../server/src/lib/store';
import { extractToken, verifyToken } from '../../server/src/lib/auth';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const token = extractToken(event.headers.authorization);
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    const user = verifyToken(token);
    if (!user) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden' }),
      };
    }

    const employee = store.findEmployeeById(user.id);
    if (!employee) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      };
    }

    const { passwordHash, ...profile } = employee;

    return {
      statusCode: 200,
      body: JSON.stringify(profile),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export { handler };
