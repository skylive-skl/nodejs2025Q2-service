import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.prisma.album.create({
      data: {
        artistId: createAlbumDto.artistId || null,
        ...createAlbumDto,
      },
    });
    return newAlbum;
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findByIds(ids: string[]) {
    return await this.prisma.album.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findOne(id: string) {
    return await this.prisma.album.findUnique({ where: { id } });
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) return null;
    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: { ...album, ...updateAlbumDto },
    });
    return updatedAlbum;
  }

  async remove(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) return null;
    await this.prisma.album.delete({ where: { id } });
    return { id };
  }

  async removeArtistIdFromAlbums(artistId: string) {
    await this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
