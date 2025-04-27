export enum UserRole {
  ADMIN = 'admin',
  AGENT = 'agent',
  CUSTOMER = 'customer'
}

export interface User {
  _id: string;
  fullname: string;
  email: string;
  password?: string; // Optionnel car on ne veut pas le stocker dans le front
  role: UserRole;
  action?: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number; // Si vous utilisez Mongoose
}