import { Position } from '../positions/position.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Sector } from '../sectors/sector.entity';
import { Industry } from '../industries/industries.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Position, (position) => position.user)
  positions: Position[];

  @OneToMany(() => Sector, (sector) => sector.user)
  sectors: Sector[];

  @OneToMany(() => Industry, (industry) => industry.user)
  industries: Industry[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with ID: ', this.id);
  }
  @AfterRemove()
  logRemove() {
    console.log('Removed User with ID: ', this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with ID: ', this.id);
  }
}
