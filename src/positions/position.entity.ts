import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column()
  sharesOwned?: number;

  @Column()
  averageCostBasis?: number;

  // @Column()
  // userId: number;

  // @Column()
  // sectorId: number;

  // @Column()
  // industryId: number;
}
