import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignupCredentialDto {
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  @ApiProperty({ type: String, description: 'student id' })
  studentId: string;
  @IsString()
  @MinLength(4)
  @ApiProperty({ type: String, description: 'username' })
  username: string;
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/, {
    message:
      'include at least one english character, one number and one special character',
  })
  @ApiProperty({ type: String, description: 'password' })
  password: string;
}