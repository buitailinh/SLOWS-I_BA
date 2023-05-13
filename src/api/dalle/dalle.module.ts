import { CloudinaryModule } from './../../share/cloudinary/cloudinary.module';
import { UserModule } from 'src/api/user/user.module';
import { dalleProvider } from './dalle.provider';
import { DalleRepository } from './dalle.repository';
import { DatabaseModule } from './../../configs/database/database.module';
import { Module } from '@nestjs/common';
import { DalleService } from './dalle.service';
import { DalleController } from './dalle.controller';

@Module({
  imports: [DatabaseModule, UserModule, CloudinaryModule],
  controllers: [DalleController],
  providers: [DalleService, DalleRepository, ...dalleProvider],
  exports: [DalleService, DalleRepository,]
})
export class DalleModule { }
