import { User } from './user.interface';

export interface LoginResponse {
  status: number;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}