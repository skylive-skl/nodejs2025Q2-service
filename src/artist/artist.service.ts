import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    const artist = await this.prisma.artist.create({ data: createArtistDto });
    return artist;
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findByIds(ids: string[]) {
    return await this.prisma.artist.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.artist.findUnique({ where: { id } });
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) return null;

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: { ...artist, ...updateArtistDto },
    });
    return updatedArtist;
  }

  async remove(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) return null;

    await this.prisma.artist.delete({ where: { id } });
    return { id };
  }
}
