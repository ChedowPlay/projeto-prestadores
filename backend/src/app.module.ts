import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { WorkersModule } from './workers/workers.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, WorkersModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
