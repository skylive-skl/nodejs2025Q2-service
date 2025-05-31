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
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { StatusCodes } from 'http-status-codes';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { FavoriteService } from 'src/favorite/favorite.service';

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', UUIDValidationPipe) id: string) {
    const track = this.trackService.findOne(id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return track;
  }

  @Put(':id')
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const updated = this.trackService.update(id, updateTrackDto);
    if (!updated) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return updated;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    const removed = this.trackService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    this.favoriteService.removeTrackFromFavorites(id);
    return this.trackService.remove(id);
  }
}
