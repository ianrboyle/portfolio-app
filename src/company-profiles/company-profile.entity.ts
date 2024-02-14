import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CompanyProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
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

  @Column({ type: 'boolean', default: false })
  isCustomProfile: boolean;
}
