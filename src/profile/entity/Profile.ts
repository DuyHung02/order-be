import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
  gender: string;

  @Column({ type: 'longtext' })
  avatar: string;

  @Column({type: 'double', default: 0})
  balance: number;
}
