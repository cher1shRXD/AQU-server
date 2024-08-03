import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateBoardDto } from "./dto/create-board.dto";
import { Board } from "./board.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BoardRepository } from "./board.repository";
import { User } from "src/auth/user.entity";
import { plainToClass } from "class-transformer";

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository
  ) {}

  async getAllBoards(): Promise<Board[]> {
    const boards = await this.boardRepository.find({
      relations: ["author"],
      order: {
        id: "DESC",
      },
    });

    return boards.map((board) => {
      board.author = plainToClass(User, board.author);
      return board;
    });
  }

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User
  ): Promise<Board> {
    const { title, url } = createBoardDto;
    const createdAt = new Date().toLocaleDateString();
    const newContent = this.boardRepository.create({
      title,
      url,
      createdAt,
      author: user,
    });
    return await this.boardRepository.save(newContent);
  }

  async getBoardById(boardId: number): Promise<Board> {
    const res = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ["author"],
    });
    if (!res) {
      throw new NotFoundException(
        `There's no content has ${boardId} for its id`
      );
    }
    res.author = plainToClass(User, res.author);
    return res;
  }

  async deleteBoard(boardId: number, user: User): Promise<void> {
    const res = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: ["author"],
    });
    if (!res) {
      throw new NotFoundException(
        `There's no content has ${boardId} for its id`
      );
    }
    if (res.author.id != user.id) {
      throw new UnauthorizedException("you're not a author");
    }

    await this.boardRepository.remove(res);
  }

  async updateBoard(
    boardId: number,
    updateBoardDto: CreateBoardDto
  ): Promise<Board> {
    const target = await this.getBoardById(boardId);
    target.url = updateBoardDto.url;
    target.title = updateBoardDto.title;
    const res = await this.boardRepository.save(target);
    return res;
  }
}
