import { Sector } from '../sectors/sector.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Industry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  industryName: string;

  @ManyToOne(() => Sector, (sector) => sector.industries)
  sector: Sector;
}
