import { Position } from '../positions/position.entity';
import { Sector } from '../sectors/sector.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Industry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  industryName: string;

  // @OneToOne(() => CompanyProfile, (companyProfile) => companyProfile.industry)
  // companyProfile: CompanyProfile;

  @ManyToOne(() => Sector, (sector) => sector.industries)
  sector: Sector;

  @OneToMany(() => Position, (position) => position.industry)
  positions: Position[];

  @ManyToOne(() => User, (user) => user.industries)
  user: User;

  // @Column()
  // userId: number;

  // @Column()
  // sectorId: number;

  // @Column()
  // industryId: number;
}
