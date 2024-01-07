import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Position {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  symbol: string;

  @Column()
  quantity: number;

  @Column()
  costPerShare: number;

  @ManyToOne(() => User, (user) => user.positions)
  user: User;

  // @OneToOne(() => CompanyProfile, (companyProfile) => companyProfile.position)
  // @JoinColumn()
  // companyProfile: CompanyProfile;
}
