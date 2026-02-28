import { Handler } from '@netlify/functions';
import { store } from '../lib/store';
import { extractToken, verifyToken } from '../lib/auth';
import { Attendance } from '../lib/types';

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
      let attendanceRecords;

      if (user.role === 'admin') {
        attendanceRecords = store.getAttendance();
      } else {
        attendanceRecords = store.getEmployeeAttendance(user.id);
      }

      return {
        statusCode: 200,
        body: JSON.stringify(attendanceRecords),
      };
    }

    if (event.httpMethod === 'POST') {
      const { date, punchIn, punchOut } = JSON.parse(event.body || '{}');

      if (!date) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Date is required' }),
        };
      }

      let attendance = store.findAttendanceByEmployeeAndDate(user.id, date);

      if (!attendance) {
        const allAttendance = store.getAttendance();
        const newId = (Math.max(...allAttendance.map(a => a.id), 0) || 0) + 1;

        attendance = {
          id: newId,
          employeeId: user.id,
          date,
          punchIn,
          punchOut,
          status: 'Present',
        };

        store.createOrUpdateAttendance(attendance);

        return {
          statusCode: 201,
          body: JSON.stringify(attendance),
        };
      }

      // Update existing record
      if (punchIn) {
        if (attendance.punchIn) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Already punched in for today' }),
          };
        }
        attendance.punchIn = punchIn;
      }

      if (punchOut) {
        if (attendance.punchOut) {
          return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Already punched out for today' }),
          };
        }
        attendance.punchOut = punchOut;
      }

      store.createOrUpdateAttendance(attendance);

      return {
        statusCode: 200,
        body: JSON.stringify(attendance),
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
