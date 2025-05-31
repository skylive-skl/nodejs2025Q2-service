import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { DbService } from 'src/db/db.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  constructor(private readonly dbService: DbService) {}
  create(createTrackDto: CreateTrackDto) {
    const track = { id: uuidv4(), ...createTrackDto };
    this.dbService.tracks.push(track);
    return track;
  }

  findAll() {
    return this.dbService.tracks;
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
    return { id };
  }
}
