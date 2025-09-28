export type UserRole = "RENTER" | "OWNER";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  isEmailVerified: boolean;
  preferences?: {
    notifications: boolean;
    marketing: boolean;
  };
}
