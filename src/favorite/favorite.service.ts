import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const favoriteTracks = await this.prisma.favoriteTrack.findMany({
      include: { track: true },
    });
    const tracks = favoriteTracks.map((fav) => fav.track);
    const favoriteAlbums = await this.prisma.favoriteAlbum.findMany({
      include: { album: true },
    });
    const albums = favoriteAlbums.map((fav) => fav.album);
    const favoriteArtists = await this.prisma.favoriteArtist.findMany({
      include: { artist: true },
    });
    const artists = favoriteArtists.map((fav) => fav.artist);
    return {
      tracks,
      albums,
      artists,
    };
  }

  addTrackToFavorites(trackId: string) {
    return this.prisma.favoriteTrack.create({
      data: { trackId },
    });
  }

  removeTrackFromFavorites(trackId: string) {
    return this.prisma.favoriteTrack.deleteMany({
      where: { trackId },
    });
  }

  addAlbumToFavorites(albumId: string) {
    return this.prisma.favoriteAlbum.create({
      data: { albumId },
    });
  }

  removeAlbumFromFavorites(albumId: string) {
    return this.prisma.favoriteAlbum.deleteMany({
      where: { albumId },
    });
  }

  addArtistToFavorites(artistId: string) {
    return this.prisma.favoriteArtist.create({
      data: { artistId },
    });
  }

  removeArtistFromFavorites(artistId: string) {
    return this.prisma.favoriteArtist.deleteMany({
      where: { artistId },
    });
  }
}
