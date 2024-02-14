import { CreatePositionDto } from '../positions/dtos/create-position-dto';
import { Position } from '../positions/position.entity';
import { mockUserOne, mockUserTwo } from './mock-user-data';

// Mock Position data
export const mockPosition1: Position = {
  id: 1,
  symbol: 'AAPL',
  quantity: 10,
  costPerShare: 100,
  user: mockUserOne,
  industryId: null,
  companyProfileId: null,
};

export const mockPosition2: Position = {
  id: 2,
  symbol: 'GOOGL',
  quantity: 25,
  costPerShare: 200.5,
  user: mockUserTwo, // Assuming you have a mock user object
  industryId: null,
  companyProfileId: null,
};
export const mockPositionWithNoCompanyProfile: Position = {
  id: 2,
  symbol: 'GOOGL',
  quantity: 25,
  costPerShare: 200.5,
  user: mockUserTwo, // Assuming you have a mock user object
  industryId: null,
  companyProfileId: null,
};

export const mockCreatePositionDtoOne: CreatePositionDto = {
  symbol: 'AAPL',
  costPerShare: 100,
  quantity: 10,
  companyProfileId: 0,
  industryId: 0,
};
export const mockCreatePositionDtoTwo: CreatePositionDto = {
  symbol: 'GOOGL',
  costPerShare: 200.5,
  quantity: 25,
  companyProfileId: 0,
  industryId: 0,
};

export const mockPositions: Position[] = [mockPosition1, mockPosition2];
