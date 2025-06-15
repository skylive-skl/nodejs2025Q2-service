import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { DbService } from 'src/db/db.service';
import { User } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = await this.prisma.user.create({ data: createUserDto });
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

  async validatePassword(id: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    if (user.password !== password) return false;
    return true;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const newUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
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
