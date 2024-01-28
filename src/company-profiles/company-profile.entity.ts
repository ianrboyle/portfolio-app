import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Position } from '../positions/position.entity';

@Entity()
export class CompanyProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column({ nullable: true })
  companyName: string;

  @Column('numeric', { precision: 10, scale: 3 })
  price: number;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  sector: string;

  @Column({ nullable: true })
  country: string;

  @OneToMany(() => Position, (position) => position.companyProfile)
  positions: Position[];
}
