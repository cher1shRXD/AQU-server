import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne((type) => User, (user) => user.board, { eager: false })
  author: User;

  @Column('longtext')
  url: string;

  @Column('longtext')
  description:string;

  @Column()
  createdAt: string;

}