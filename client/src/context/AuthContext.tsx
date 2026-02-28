import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  role: 'admin' | 'employee' | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<'admin' | 'employee' | null>(
    (localStorage.getItem('role') as 'admin' | 'employee') || null
  );

  const login = async (email: string, password: string) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setToken(res.data.token);
    setRole(res.data.role);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('role', res.data.role);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
  };

  const register = async (data: any) => {
    await axios.post('/api/auth/register', data);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, role, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
