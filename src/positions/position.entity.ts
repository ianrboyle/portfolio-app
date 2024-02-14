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

  @Column({ nullable: true })
  sectorId: number;

  @Column()
  companyProfileId: number;
}
