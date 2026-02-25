import { Module } from '@nestjs/common';
import { ProfileController, PasswordResetController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ProfileController, PasswordResetController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
