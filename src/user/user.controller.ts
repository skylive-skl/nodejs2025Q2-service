import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Put,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { UpdatePasswordDto } from './dto/update-passsword.dto';
import { StatusCodes } from 'http-status-codes';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', UUIDValidationPipe) id: string) {
    const res = this.userService.findOne(id);
    if (!res) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return res;
  }

  @Put(':id')
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const isPasswordValid = this.userService.validatePassword(
      user.id,
      updatePasswordDto.oldPassword,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const res = this.userService.update(id, {
      password: updatePasswordDto.newPassword,
    });
    return res;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    const res = this.userService.remove(id);
    if (!res) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return res;
  }
}
