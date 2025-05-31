import { Injectable } from '@nestjs/common';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artist/artist.service';
import { DbService } from 'src/db/db.service';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly dbService: DbService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  getAll() {
    return {
      tracks: this.getAllTracksByIds(this.dbService.favorites.tracks),
      albums: this.getAllAlbumsByIds(this.dbService.favorites.albums),
      artists: this.getAllArtistsByIds(this.dbService.favorites.artists),
    };
  }
  getAllTracksByIds(trackIds: Set<string>) {
    return this.trackService.findByIds(Array.from(trackIds));
  }
  getAllAlbumsByIds(albumIds: Set<string>) {
    return this.albumService.findByIds(Array.from(albumIds));
  }
  getAllArtistsByIds(artistIds: Set<string>) {
    return this.artistService.findByIds(Array.from(artistIds));
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
