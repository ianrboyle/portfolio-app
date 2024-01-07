import { Expose } from 'class-transformer';

export class PositionDto {
  @Expose()
  id: number;

  @Expose()
  symbol: string;

  @Expose()
  quantity: number;

  @Expose()
  costPerShare: number;
}
