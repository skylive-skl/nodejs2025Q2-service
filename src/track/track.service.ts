import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DbService } from 'src/db/db.service';
import { randomUUID } from 'node:crypto';
import { FavoriteService } from 'src/favorite/favorite.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly dbService: DbService,
    @Inject(forwardRef(() => FavoriteService))
    private readonly favoriteService: FavoriteService,
  ) {}
  create(createTrackDto: CreateTrackDto) {
    const track = { id: randomUUID(), ...createTrackDto };
    this.dbService.tracks.push(track);
    return track;
  }

  findAll() {
    return this.dbService.tracks;
  }

  findByIds(ids: string[]) {
    return this.dbService.tracks.filter((track) => ids.includes(track.id));
  }

  findOne(id: string) {
    return this.dbService.tracks.find((track) => track.id === id);
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const trackIndex = this.dbService.tracks.findIndex(
      (track) => track.id === id,
    );
    if (trackIndex === -1) return null;

    this.dbService.tracks[trackIndex] = {
      ...this.dbService.tracks[trackIndex],
      ...updateTrackDto,
    };
    return this.dbService.tracks[trackIndex];
  }

  remove(id: string) {
    const trackIndex = this.dbService.tracks.findIndex(
      (track) => track.id === id,
    );
    if (trackIndex === -1) return null;

    this.dbService.tracks.splice(trackIndex, 1);

    this.favoriteService.removeTrackFromFavorites(id);
    return { id };
  }

  removeAlbumIdFromTracks(albumId: string) {
    this.dbService.tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }
  removeArtistIdFromTracks(artistId: string) {
    this.dbService.tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });
  }
}
