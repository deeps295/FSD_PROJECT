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

    const pathParts = event.path?.split('/') || [];
    const id = parseInt(pathParts[pathParts.length - 2] || '0', 10);
    const action = pathParts[pathParts.length - 1];

    if (action === 'approve') {
      const { adminRemarks } = JSON.parse(event.body || '{}');
      const leave = store.findLeaveById(id);

      if (!leave) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Leave request not found' }),
        };
      }

      const updated = store.updateLeave(id, {
        status: 'approved',
        adminRemarks,
      });

      return {
        statusCode: 200,
        body: JSON.stringify(updated),
      };
    }

    if (action === 'reject') {
      const { adminRemarks } = JSON.parse(event.body || '{}');
      const leave = store.findLeaveById(id);

      if (!leave) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Leave request not found' }),
        };
      }

      const updated = store.updateLeave(id, {
        status: 'rejected',
        adminRemarks,
      });

      return {
        statusCode: 200,
        body: JSON.stringify(updated),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not found' }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};

export { handler };
