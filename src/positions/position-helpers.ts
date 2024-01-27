import { UpdatePositionDto } from './dtos/update-position-dto';
import { Position } from './position.entity';

export const updatePosition = (
  existingPosition: Position,
  updatedPosition: UpdatePositionDto,
) => {
  if (
    updatedPosition.updatedQuantity < 0 &&
    existingPosition.quantity == Math.abs(updatedPosition.updatedQuantity)
  ) {
    existingPosition.quantity = 0;
    return existingPosition;
  } else if (updatedPosition.updatedQuantity < 0) {
    existingPosition.quantity =
      existingPosition.quantity + updatedPosition.updatedQuantity;
    return existingPosition;
  }

  return calculateUpdatedPosition(existingPosition, updatedPosition);
};

const calculateCostPerShare = (totalCost: number, totalShares: number) => {
  const costPerShare = totalCost / totalShares;
  return costPerShare;
};

const calculateTotalCost = (costPerShare: number, quantity: number) => {
  return costPerShare * quantity;
};

const calculateUpdatedPosition = (
  existingPosition: Position,
  updatedPosition: UpdatePositionDto,
) => {
  const currentTotalCost = calculateTotalCost(
    existingPosition.costPerShare,
    existingPosition.quantity,
  );
  const newTotalCost = calculateTotalCost(
    updatedPosition.updatedCostPerShare,
    updatedPosition.updatedQuantity,
  );

  const updatedQuantity =
    existingPosition.quantity + updatedPosition.updatedQuantity;

  const updatedTotalCost = currentTotalCost + newTotalCost;

  const updatedCostPerShare = calculateCostPerShare(
    updatedTotalCost,
    updatedQuantity,
  );

  existingPosition.costPerShare = updatedCostPerShare;
  existingPosition.quantity = updatedQuantity;
  return existingPosition;
};
