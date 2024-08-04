import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, description: "title" })
  title: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: "video url" })
  url: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: "descriptions" })
  description: string;
}