import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  HttpCode,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';
import { StatusCodes } from 'http-status-codes';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';

@Controller('favs')
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}
  @Get()
  findAll() {
    return this.favoriteService.getAll();
  }

  @Post('track/:id')
  @HttpCode(StatusCodes.CREATED)
  async addTrack(@Param('id', UUIDValidationPipe) id: string) {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new UnprocessableEntityException(`Track with ID ${id} not found`);
    }
    await this.favoriteService.addTrackToFavorites(id);
    return track;
  }

  @Delete('track/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeTrack(@Param('id', UUIDValidationPipe) id: string) {
    const track = await this.trackService.findOne(id);
    if (!track) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
    return this.favoriteService.removeTrackFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(StatusCodes.CREATED)
  async addAlbum(@Param('id', UUIDValidationPipe) id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new UnprocessableEntityException(`Album with ID ${id} not found`);
    }
    await this.favoriteService.addAlbumToFavorites(id);
    return album;
  }

  @Delete('album/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeAlbum(@Param('id', UUIDValidationPipe) id: string) {
    const album = await this.albumService.findOne(id);
    if (!album) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
    return this.favoriteService.removeAlbumFromFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(StatusCodes.CREATED)
  async addArtist(@Param('id', UUIDValidationPipe) id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new UnprocessableEntityException(`Artist with ID ${id} not found`);
    }
    await this.favoriteService.addArtistToFavorites(id);
    return artist;
  }

  @Delete('artist/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  async removeArtist(@Param('id', UUIDValidationPipe) id: string) {
    const artist = await this.artistService.findOne(id);
    if (!artist) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return this.favoriteService.removeArtistFromFavorites(id);
  }
}
