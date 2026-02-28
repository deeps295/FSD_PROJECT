import { Handler } from '@netlify/functions';
import { store } from '../../server/src/lib/store';
import { extractToken, verifyToken } from '../../server/src/lib/auth';
import { LeaveRequest } from '../../server/src/lib/types';

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
    if (!user) {
      return {
        statusCode: 403,
        body: JSON.stringify({ message: 'Forbidden' }),
      };
    }

    if (event.httpMethod === 'GET') {
      let leaveRecords;

      if (user.role === 'admin') {
        leaveRecords = store.getLeaves();
      } else {
        leaveRecords = store.getEmployeeLeaves(user.id);
      }

      return {
        statusCode: 200,
        body: JSON.stringify(leaveRecords),
      };
    }

    if (event.httpMethod === 'POST') {
      const { leaveType, reason, fromDate, toDate } = JSON.parse(
        event.body || '{}'
      );

      if (!leaveType || !fromDate || !toDate) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Missing required fields' }),
        };
      }

      const allLeaves = store.getLeaves();
      const newLeave: LeaveRequest = {
        id: (Math.max(...allLeaves.map(l => l.id), 0) || 0) + 1,
        employeeId: user.id,
        leaveType,
        reason,
        fromDate,
        toDate,
        status: 'pending',
      };

      store.createLeave(newLeave);

      return {
        statusCode: 201,
        body: JSON.stringify(newLeave),
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
