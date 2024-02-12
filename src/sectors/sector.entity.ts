import { Industry } from '../industries/industries.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Position } from '../positions/position.entity';

@Entity()
export class Sector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sectorName: string;

  @OneToMany(() => Industry, (industry) => industry.sector)
  industries: Industry[];

  @OneToMany(() => Position, (position) => position.sector)
  positions: Position[];

  @ManyToOne(() => User, (user) => user.sectors)
  user: User;
}
