import { IsNumber } from 'class-validator';

export class UpdatePositionDto {
  @IsNumber()
  updatedQuantity: number;

  @IsNumber()
  updatedCostPerShare: number;
}
