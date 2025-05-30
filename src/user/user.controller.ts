import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const res = this.userService.findOne(id);
    if (!res) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return res;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const res = this.userService.update(id, updateUserDto);
    if (!res) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return res;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const res = this.userService.remove(id);
    if (!res) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return res;
  }
}
