import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';

@Global()
@Module({
  providers: [DbService],
  exports: [DbService], // Export DbService so it can be used in other modules
})
export class DbModule {}
