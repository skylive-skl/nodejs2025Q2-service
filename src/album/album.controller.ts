import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { StatusCodes } from 'http-status-codes';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('album')
@UseGuards(JwtAuthGuard)
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @HttpCode(StatusCodes.CREATED)
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  async findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', UUIDValidationPipe) id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return album;
  }

  @Put(':id')
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    const updated = await this.albumService.update(id, updateAlbumDto);
    if (!updated) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return updated;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('id', UUIDValidationPipe) id: string) {
    const removed = await this.albumService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return;
  }
}
