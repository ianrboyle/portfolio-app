import { mockCompanyProfileDataOne } from '../mock-data/mock-company-profile-data';

import { mockUserOne } from '../mock-data/mock-user-data';
import { UpdatePositionDto } from './dtos/update-position-dto';
import { updatePosition } from './position-helpers';
import { Position } from './position.entity';

let updateDto: UpdatePositionDto = {
  updatedQuantity: 10,
  updatedCostPerShare: 50,
};
describe('updatePosition', () => {
  beforeEach(async () => {
    updateDto = {
      updatedQuantity: 10,
      updatedCostPerShare: 50,
    };
  });

  it('should update quantity and cost per share when quantity is positive', () => {
    const initialPosition: Position = {
      id: 1,
      symbol: 'AAPL',
      quantity: 10,
      costPerShare: 100,
      user: mockUserOne,
      companyProfileId: mockCompanyProfileDataOne.id,
      sectorId: 0,
    };
    const expectedQuantity =
      initialPosition.quantity + updateDto.updatedQuantity;

    const expectedCostPerShare =
      (initialPosition.costPerShare * initialPosition.quantity +
        updateDto.updatedCostPerShare * updateDto.updatedQuantity) /
      (initialPosition.quantity + updateDto.updatedQuantity);

    const updatedPosition = updatePosition(initialPosition, updateDto);

    expect(updatedPosition.quantity).toEqual(expectedQuantity);
    expect(updatedPosition.costPerShare).toEqual(expectedCostPerShare);
  });

  it('should set quantity to zero when updated quantity is negative and equal to current quantity', () => {
    const initialPosition: Position = {
      id: 1,
      symbol: 'AAPL',
      quantity: 10,
      costPerShare: 100,
      user: mockUserOne,
      companyProfileId: mockCompanyProfileDataOne.id,
      sectorId: 0,
    };
    const updateDtoNegative = {
      updatedQuantity: -10,
      updatedCostPerShare: 5,
    };

    const updatedPosition = updatePosition(initialPosition, updateDtoNegative);

    expect(updatedPosition.quantity).toEqual(0);
    expect(updatedPosition.costPerShare).toEqual(initialPosition.costPerShare); // Cost per share should remain unchanged
  });

  it('should decrease quantity when updated quantity is negative and not equal to current quantity', () => {
    const initialPosition: Position = {
      id: 1,
      symbol: 'AAPL',
      quantity: 10,
      costPerShare: 100,
      user: mockUserOne,
      companyProfileId: mockCompanyProfileDataOne.id,
      sectorId: 0,
    };
    const updateDtoNegative = {
      updatedQuantity: -5,
      updatedCostPerShare: 5,
    };
    const expectedUpdatedQuantity =
      initialPosition.quantity + updateDtoNegative.updatedQuantity;
    const updatedPosition = updatePosition(initialPosition, updateDtoNegative);

    expect(updatedPosition.quantity).toEqual(expectedUpdatedQuantity);
    expect(updatedPosition.costPerShare).toEqual(initialPosition.costPerShare); // Cost per share should remain unchanged
  });

  it('should handle zero division when totalShares is 0', () => {
    const initialPosition: Position = {
      id: 1,
      symbol: 'AAPL',
      quantity: 0,
      costPerShare: 0,
      user: mockUserOne,
      companyProfileId: mockCompanyProfileDataOne.id,
      sectorId: 0,
    };

    const updatedPosition = updatePosition(initialPosition, updateDto);

    expect(updatedPosition.quantity).toEqual(updateDto.updatedQuantity);
    expect(updatedPosition.costPerShare).toEqual(updateDto.updatedCostPerShare);
  });

  // Add more tests as needed based on your specific use cases and edge cases.
});
