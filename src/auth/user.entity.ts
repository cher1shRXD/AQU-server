import { Exclude } from "class-transformer";
import { Board } from "src/boards/board.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  username:string;

  @Column()
  @Exclude()
  password:string;

  @OneToMany(type=> Board, board => board.author, { eager:false })
  board: Board[]

}