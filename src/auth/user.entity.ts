import { Board } from "src/boards/board.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['studentId'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  studentId:string;

  @Column()
  username:string;

  @Column()
  password:string;

  @OneToMany(type=> Board, board => board.author, { eager:true })
  board: Board[]

}