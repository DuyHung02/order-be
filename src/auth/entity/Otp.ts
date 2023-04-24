import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: number;

  @Column()
  created_at: Date;
}
