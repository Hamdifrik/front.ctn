/*import { User, UserRole, LoginCredentials, RegisterData } from '../types/auth';

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Customer',
    email: 'customer@example.com',
    role: 'customer',
    avatar: 'https://i.pravatar.cc/150?u=customer',
  },
  {
    id: '2',
    name: 'Sarah Agent',
    email: 'agent@example.com',
    role: 'agent',
    avatar: 'https://i.pravatar.cc/150?u=agent',
  },
  {
    id: '3',
    name: 'Mike Admin',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
  },
];

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock login function
export const mockLogin = async (email: string, password: string): Promise<User> => {
  await delay(1000); // Simulate API call
  
  const user = mockUsers.find(user => user.email === email);
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // In a real app, you would verify the password here
  // For the mock, we'll assume any password is valid
  
  return user;
};

// Mock register function
export const mockRegister = async (
  name: string, 
  email: string, 
  password: string, 
  role: UserRole
): Promise<User> => {
  await delay(1000); // Simulate API call
  
  const userExists = mockUsers.some(user => user.email === email);
  
  if (userExists) {
    throw new Error('User with this email already exists');
  }
  
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    name,
    email,
    role,
    avatar: `https://i.pravatar.cc/150?u=${email}`,
  };
  
  mockUsers.push(newUser);
  
  return newUser;
};

// Mock logout function
export const mockLogout = async (): Promise<void> => {
  await delay(500); // Simulate API call
  // In a real app, you would invalidate the session/token on the server
};*/