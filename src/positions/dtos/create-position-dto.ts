import { IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../../users/user.entity';

export class CreatePositionDto {
  @IsString()
  symbol: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  costPerShare: number;

  @IsOptional()
  user?: User;

  @IsOptional()
  @IsNumber()
  companyProfileId: number;

  @IsOptional()
  @IsNumber()
  industryId: number;
}
