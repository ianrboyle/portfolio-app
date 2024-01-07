import { IsNumber, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  symbol: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  costPerShare: number;
}
