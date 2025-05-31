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

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}
  @Get()
  findAll() {
    return this.favoriteService.getAll();
  }

  @Post('track/:id')
  @HttpCode(StatusCodes.CREATED)
  addTrack(@Param('id', UUIDValidationPipe) id: string) {
    const res = this.favoriteService.addTrackToFavorites(id);
    if (!res) {
      throw new UnprocessableEntityException(`Track with ID ${id} not found`);
    }
  }

  @Delete('track/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  removeTrack(@Param('id', UUIDValidationPipe) id: string) {
    const res = this.favoriteService.removeTrackFromFavorites(id);
    if (!res) {
      throw new NotFoundException(`Track with ID ${id} not found`);
    }
  }

  @Post('album/:id')
  @HttpCode(StatusCodes.CREATED)
  addAlbum(@Param('id', UUIDValidationPipe) id: string) {
    const res = this.favoriteService.addAlbumToFavorites(id);
    if (!res) {
      throw new UnprocessableEntityException(`Album with ID ${id} not found`);
    }
  }

  @Delete('album/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  removeAlbum(@Param('id', UUIDValidationPipe) id: string) {
    const res = this.favoriteService.removeAlbumFromFavorites(id);
    if (!res) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }
  }

  @Post('artist/:id')
  @HttpCode(StatusCodes.CREATED)
  addArtist(@Param('id', UUIDValidationPipe) id: string) {
    const res = this.favoriteService.addArtistToFavorites(id);
    if (!res) {
      throw new UnprocessableEntityException(`Artist with ID ${id} not found`);
    }
    return this.favoriteService.addArtistToFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(StatusCodes.NO_CONTENT)
  removeArtist(@Param('id', UUIDValidationPipe) id: string) {
    const res = this.favoriteService.removeArtistFromFavorites(id);
    if (!res) {
      throw new NotFoundException(`Artist with ID ${id} not found`);
    }
    return this.favoriteService.removeArtistFromFavorites(id);
  }
}
