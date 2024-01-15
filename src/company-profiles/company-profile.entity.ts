import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Position } from '../positions/position.entity';

@Entity()
export class CompanyProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column()
  price: number;

  @OneToMany(() => Position, (position) => position.companyProfile)
  positions: Position[];
}
