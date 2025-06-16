import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashService } from './hash.service';

@Injectable()
export class UserService {
  constructor(
    private hashService: HashService,
    private prisma: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = {
      login: createUserDto.login,
      password: await this.hashService.hash(createUserDto.password),
    };
    const newUser = await this.prisma.user.create({ data: user });
    return this.hidePassword(newUser);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    if (!users) return [];
    return users.map((user) => {
      return this.hidePassword(user);
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return this.hidePassword(user);
  }
  async getUserByLogin(login: string) {
    const user = await this.prisma.user.findFirst({ where: { login } });
    if (!user) return null;
    return user;
  }

  async validatePassword(id: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const isValid = await this.hashService.comparePassword(
      password,
      user.password,
    );
    return isValid;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const password = await this.hashService.hash(updateUserDto.password);
    const newUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password,
        version: user.version + 1,
        updatedAt: new Date(),
      },
    });

    return this.hidePassword(newUser);
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    await this.prisma.user.delete({ where: { id } });
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
