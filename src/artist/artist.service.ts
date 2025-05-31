import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { DbService } from 'src/db/db.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class ArtistService {
  constructor(private readonly dbService: DbService) {}

  create(createArtistDto: CreateArtistDto) {
    const artist = { id: randomUUID(), ...createArtistDto };
    this.dbService.artists.push(artist);
    return artist;
  }

  findAll() {
    return this.dbService.artists;
  }

  findByIds(ids: string[]) {
    return this.dbService.artists.filter((artist) => ids.includes(artist.id));
  }

  findOne(id: string) {
    return this.dbService.artists.find((artist) => artist.id === id);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artistIndex = this.dbService.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (artistIndex === -1) return null;

    this.dbService.artists[artistIndex] = {
      ...this.dbService.artists[artistIndex],
      ...updateArtistDto,
    };
    return this.dbService.artists[artistIndex];
  }

  remove(id: string) {
    const artistIndex = this.dbService.artists.findIndex(
      (artist) => artist.id === id,
    );
    if (artistIndex === -1) return null;

    this.dbService.artists.splice(artistIndex, 1);
    return { id };
  }
}
