import { Module } from '@nestjs/common';
import { FirebaseDatabaseService } from './firebase-admin.service';

@Module({
  providers: [FirebaseDatabaseService],
  exports: [FirebaseDatabaseService],
})
export class FirebaseAdminModule { }
