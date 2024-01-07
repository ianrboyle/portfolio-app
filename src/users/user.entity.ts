import { Position } from 'src/positions/position.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

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
