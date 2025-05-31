import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DbService } from 'src/db/db.service';
import { randomUUID } from 'node:crypto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DbService) {}

  create(createUserDto: CreateUserDto) {
    const user = {
      id: randomUUID(),
      ...createUserDto,
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
      version: 1,
    };

    this.dbService.users.push(user);
    return this.hidePassword(user);
  }

  findAll() {
    return this.dbService.users.map((user) => {
      return this.hidePassword(user);
    });
  }

  findOne(id: string) {
    const user = this.dbService.users.find((user) => user.id === id);
    if (!user) return null;
    return this.hidePassword(user);
  }

  validatePassword(id: string, password: string) {
    const user = this.dbService.users.find((user) => user.id === id);
    if (!user) return null;
    if (user.password !== password) return false;
    return true;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.dbService.users.find((user) => user.id === id);
    if (!user) return null;
    const newUser = Object.assign({}, user, updateUserDto);
    newUser.updatedAt = new Date().getTime();
    newUser.version += 1;
    const userIndex = this.dbService.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;
    this.dbService.users[userIndex] = newUser;
    return this.hidePassword(newUser);
  }

  remove(id: string) {
    const userIndex = this.dbService.users.findIndex((user) => user.id === id);
    if (userIndex === -1) return null;
    this.dbService.users.splice(userIndex, 1);
    return { id };
  }

  private hidePassword(user: User): Omit<User, 'password'> {
    return {
      id: user.id,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      version: user.version,
    };
  }
}
