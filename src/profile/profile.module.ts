import { Module } from '@nestjs/common';
import { ProfileService } from './service/profile.service';
import { ProfileController } from './controller/profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entity/Profile';
import { User } from "../user/entity/User";
import { Otp } from "../auth/entity/Otp";

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User, Otp])],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
