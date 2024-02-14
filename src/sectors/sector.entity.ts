import { Industry } from '../industries/industries.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Sector {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sectorName: string;

  @OneToMany(() => Industry, (industry) => industry.sector)
  industries: Industry[];
}
