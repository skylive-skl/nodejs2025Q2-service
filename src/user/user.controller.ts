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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { UpdatePasswordDto } from './dto/update-passsword.dto';
import { StatusCodes } from 'http-status-codes';
import { UserResponseDto } from './dto/response-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(StatusCodes.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return new UserResponseDto(user);
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => new UserResponseDto(user));
  }

  @Get(':id')
  async findOne(@Param('id', UUIDValidationPipe) id: string) {
    const res = await this.userService.findOne(id);
    if (!res) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return new UserResponseDto(res);
  }

  @Put(':id')
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const isPasswordValid = await this.userService.validatePassword(
      user.id,
      updatePasswordDto.oldPassword,
    );
    console.log('isPasswordValid', isPasswordValid);
    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const res = await this.userService.update(id, {
      password: updatePasswordDto.newPassword,
    });
    return new UserResponseDto(res);
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('id', UUIDValidationPipe) id: string) {
    const res = await this.userService.remove(id);
    console.log('removed user', res);
    if (!res) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return new UserResponseDto(res);
  }
}
