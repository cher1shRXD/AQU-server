import { ApiProperty } from "@nestjs/swagger";

export class LoginCredentialDto {
  @ApiProperty({ type: String, description: 'student id' })
  studentId: string;
  @ApiProperty({ type: String, description: 'password' })
  password: string;
}
