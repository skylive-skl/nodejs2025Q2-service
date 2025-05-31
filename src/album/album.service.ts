import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DbService } from 'src/db/db.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumService {
  constructor(private readonly dbService: DbService) {}

  create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = {
      id: uuidv4(),
      artistId: createAlbumDto.artistId || null,
      ...createAlbumDto,
    };
    this.dbService.albums.push(newAlbum);
    return newAlbum;
  }

  findAll() {
    return this.dbService.albums;
  }

  findOne(id: string) {
    return this.dbService.albums.find((album) => album.id === id);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const albumIndex = this.dbService.albums.findIndex(
      (album) => album.id === id,
    );
    if (albumIndex === -1) return null;
    const updatedAlbum = {
      ...this.dbService.albums[albumIndex],
      ...updateAlbumDto,
    };
    this.dbService.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  remove(id: string) {
    const albumIndex = this.dbService.albums.findIndex(
      (album) => album.id === id,
    );
    if (albumIndex === -1) return null;
    this.dbService.albums.splice(albumIndex, 1);
    return { id };
  }

  removeArtistIdFromAlbums(artistId: string) {
    this.dbService.albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }
}
