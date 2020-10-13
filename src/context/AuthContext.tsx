/* eslint-disable @typescript-eslint/ban-types */
import React, { createContext, useCallback, useState } from 'react';
import api from '../services/api';

interface AuthState {
  token: string;
  mappedUser: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const mappedUser = localStorage.getItem('@GoBarber:mappedUser');

    if (token && mappedUser) {
      return { token, mappedUser: JSON.parse(mappedUser) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, mappedUser } = response.data;

    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:mappedUser', JSON.stringify(mappedUser));

    setData({ token, mappedUser });
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.mappedUser, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
