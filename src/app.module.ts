import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [UserModule, DbModule, ArtistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
