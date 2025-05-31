import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { StatusCodes } from 'http-status-codes';
import { AlbumService } from 'src/album/album.service';
import { TrackService } from 'src/track/track.service';

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  @Post()
  @HttpCode(StatusCodes.CREATED)
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', UUIDValidationPipe) id: string) {
    const artist = this.artistService.findOne(id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  @Put(':id')
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const artist = this.artistService.update(id, updateArtistDto);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return artist;
  }

  @Delete(':id')
  @HttpCode(StatusCodes.NO_CONTENT)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    const artist = this.artistService.remove(id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    this.albumService.removeArtistIdFromAlbums(id);
    this.trackService.removeArtistIdFromTracks(id);

    return artist;
  }
}
