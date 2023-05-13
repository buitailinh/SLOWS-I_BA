import { JobQueueModule } from './../../share/job-queue/job-queue.module';
import { UserGateway } from './user.gateway';
import { FollowingModule } from './../following/following.module';
import { FirebaseAdminModule } from './../../share/common/external-services/firebase-admin/firebase-admin.module';
import { CloudinaryModule } from './../../share/cloudinary/cloudinary.module';
import { ExportDataService } from './exportdata.service';
import { UserController } from './user.controller';
import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'src/configs/database/database.module';
import { userProvider } from './user.provider';
@Module({
  imports: [DatabaseModule, CloudinaryModule, FirebaseAdminModule, FollowingModule],
  controllers: [UserController],
  providers: [UserService, ExportDataService, UserRepository, ...userProvider, UserGateway],
  exports: [UserService, ExportDataService, UserRepository],
})
export class UserModule { }
