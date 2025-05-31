import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly dbService: DbService) {}

  getAll() {
    return {
      tracks: Array.from(this.dbService.favorites.tracks.values()),
      albums: Array.from(this.dbService.favorites.albums.values()),
      artists: Array.from(this.dbService.favorites.artists.values()),
    };
  }

  addTrackToFavorites(trackId: string) {
    return this.dbService.favorites.tracks.add(trackId);
  }

  removeTrackFromFavorites(trackId: string) {
    return this.dbService.favorites.tracks.delete(trackId);
  }

  addAlbumToFavorites(albumId: string) {
    return this.dbService.favorites.albums.add(albumId);
  }

  removeAlbumFromFavorites(albumId: string) {
    return this.dbService.favorites.albums.delete(albumId);
  }

  addArtistToFavorites(artistId: string) {
    return this.dbService.favorites.artists.add(artistId);
  }

  removeArtistFromFavorites(artistId: string) {
    return this.dbService.favorites.artists.delete(artistId);
  }
}
