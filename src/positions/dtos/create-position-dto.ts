import { IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from '../../users/user.entity';
import { CompanyProfile } from '../../company-profiles/company-profile.entity';

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
  companyProfile?: CompanyProfile;
}
