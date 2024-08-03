import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { SignupCredentialDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(signupCredentialDto: SignupCredentialDto): Promise<void> {
    const { studentId, username, password } = signupCredentialDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.create({
      studentId,
      username,
      password: hashedPassword,
    });

    try {
      await this.save(newUser);
    } catch (err) {
      console.log(err);
      if (err.code == 'ER_DUP_ENTRY') {
        throw new ConflictException('Existing student id');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
