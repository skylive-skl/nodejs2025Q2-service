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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { StatusCodes } from 'http-status-codes';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('track')
@UseGuards(JwtAuthGuard)
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(StatusCodes.CREATED)
  async create(@Body() createTrackDto: CreateTrackDto) {
    return await this.trackService.create(createTrackDto);
  }

  @Get()
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', UUIDValidationPipe) id: string) {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return track;
  }

  @Put(':id')
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const updated = await this.trackService.update(id, updateTrackDto);
    if (!updated) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }

    return updated;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async remove(@Param('id', UUIDValidationPipe) id: string) {
    const removed = await this.trackService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return removed;
  }
}
