import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User';
import { Profile } from '../profile/entity/Profile';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { Otp } from '../auth/entity/Otp';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Otp])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
