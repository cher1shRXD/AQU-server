import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';

import { Board } from './board.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('boards')
@ApiBearerAuth('access-token')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  async getAllBoards(): Promise<Board[]> {
    return this.boardsService.getAllBoards();
  }


  @Get('/:id')
  async getBoardById(@Param('id') boardId: number): Promise<Board> {
    return this.boardsService.getBoardById(boardId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard('jwt'))
  async createBoards(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  async deleteBoard(
    @Param('id') boardId: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.boardsService.deleteBoard(boardId, user);
  }

  @Patch('/:id/edit')
  @UseGuards(AuthGuard('jwt'))
  async updateBoard(
    @Param('id') boardId: number,
    @Body() updateBoardDto: CreateBoardDto,
  ): Promise<Board> {
    return this.boardsService.updateBoard(boardId, updateBoardDto);
  }
}
