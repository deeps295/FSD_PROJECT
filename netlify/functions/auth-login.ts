import { Handler } from '@netlify/functions';
import bcrypt from 'bcryptjs';
import { store } from '../../server/src/lib/store';
import { generateToken } from '../../server/src/lib/auth';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}');

    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email and password required' }),
      };
    }

    const user = store.findEmployeeByEmail(email);
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Invalid credentials' }),
      };
    }

    const token = generateToken({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
        role: user.role,
        email: user.email,
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
