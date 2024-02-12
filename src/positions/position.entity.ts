import { CompanyProfile } from '../company-profiles/company-profile.entity';
import { Industry } from '../industries/industries.entity';
import { Sector } from '../sectors/sector.entity';
import { User } from '../users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column('numeric', { precision: 10, scale: 3 })
  quantity: number;

  @Column('numeric', { precision: 10, scale: 3 })
  costPerShare: number;

  @ManyToOne(() => User, (user) => user.positions)
  user: User;

  @ManyToOne(() => Sector, (sector) => sector.positions)
  sector: Sector;

  @ManyToOne(() => Industry, (industry) => industry.positions)
  industry: Industry;

  @ManyToOne(() => CompanyProfile, (companyProfile) => companyProfile.positions)
  companyProfile: CompanyProfile;
}
