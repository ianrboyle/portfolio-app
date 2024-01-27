import { Expose, Transform } from 'class-transformer';

export class PositionDto {
  @Expose()
  id: number;

  @Expose()
  symbol: string;

  @Expose()
  quantity: number;

  @Expose()
  costPerShare: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;

  @Transform(({ obj }) => obj.companyProfile.id)
  @Expose()
  companyProfileId: number;
}
