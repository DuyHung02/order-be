import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User';
import { Profile } from '../profile/entity/Profile';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
