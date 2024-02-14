import { User } from '../users/user.entity';
import { mockPosition1 } from './mock-position-data';

export const mockUserOne: User = {
  id: 1,
  email: 'email@test.com',
  password: 'password',
  positions: [mockPosition1],
  logInsert: function (): void {
    throw new Error('Function not implemented.');
  },
  logRemove: function (): void {
    throw new Error('Function not implemented.');
  },
  logUpdate: function (): void {
    throw new Error('Function not implemented.');
  },
};
export const mockUserTwo: User = {
  id: 2,
  email: 'mockUserTwo@test.com',
  password: 'password',
  positions: [],
  logInsert: function (): void {
    throw new Error('Function not implemented.');
  },
  logRemove: function (): void {
    throw new Error('Function not implemented.');
  },
  logUpdate: function (): void {
    throw new Error('Function not implemented.');
  },
};
