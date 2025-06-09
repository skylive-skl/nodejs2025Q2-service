import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { FavoriteService } from 'src/favorite/favorite.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => FavoriteService))
    private readonly favoriteService: FavoriteService,
  ) {}
  async create(createTrackDto: CreateTrackDto) {
    const track = await this.prisma.track.create({
      data: createTrackDto,
    });
    return track;
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findByIds(ids: string[]) {
    return await this.prisma.track.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.track.findUnique({ where: { id } });
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) return null;

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: { ...track, ...updateTrackDto },
    });
    return updatedTrack;
  }

  async remove(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) return null;

    await this.prisma.track.delete({ where: { id } });

    this.favoriteService.removeTrackFromFavorites(id);
    return { id };
  }

  async removeAlbumIdFromTracks(albumId: string) {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }

  async removeArtistIdFromTracks(artistId: string) {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
