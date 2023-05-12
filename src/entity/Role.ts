import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../user/entity/User';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  //
  // @OneToMany(() => User, (user) => user.role)
  // users: User[]

}
