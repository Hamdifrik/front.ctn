import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '../types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullname: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('ctn-user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser._id && parsedUser.email) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('ctn-user');
        }
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem('ctn-user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/users');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const users = await response.json();
      const foundUser = users.find(
        (user: any) => user.email === email && user.password === password
      );
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Format the user object according to our interface
      const authenticatedUser: User = {
        _id: foundUser._id,
        fullname: foundUser.fullname,
        email: foundUser.email,
        role: foundUser.role,
        action: foundUser.action,
        createdAt: foundUser.createdAt,
        updatedAt: foundUser.updatedAt
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('ctn-user', JSON.stringify(authenticatedUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (fullname: string, email: string, password: string, role: UserRole) => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname,
          email,
          password,
          role,
          action: role === 'agent' ? 'New Agent' : null
        }),
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      const newUser = await response.json();
      
      const registeredUser: User = {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        action: newUser.action,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };
      
      setUser(registeredUser);
      localStorage.setItem('ctn-user', JSON.stringify(registeredUser));
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('ctn-user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};