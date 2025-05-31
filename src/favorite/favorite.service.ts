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
    const trackIndex = this.dbService.tracks.findIndex(
      (track) => track.id === trackId,
    );
    if (trackIndex === -1) return false;
    return this.dbService.favorites.tracks.add(trackId);
  }

  removeTrackFromFavorites(trackId: string) {
    return this.dbService.favorites.tracks.delete(trackId);
  }

  addAlbumToFavorites(albumId: string) {
    const albumIndex = this.dbService.albums.findIndex(
      (album) => album.id === albumId,
    );
    if (albumIndex === -1) return false;
    return this.dbService.favorites.albums.add(albumId);
  }

  removeAlbumFromFavorites(albumId: string) {
    return this.dbService.favorites.albums.delete(albumId);
  }

  addArtistToFavorites(artistId: string) {
    const artistIndex = this.dbService.artists.findIndex(
      (artist) => artist.id === artistId,
    );
    if (artistIndex === -1) return false;
    return this.dbService.favorites.artists.add(artistId);
  }

  removeArtistFromFavorites(artistId: string) {
    return this.dbService.favorites.artists.delete(artistId);
  }
}
