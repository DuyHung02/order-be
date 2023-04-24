import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entity/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategy';
import { Otp } from './entity/Otp';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User, Otp])],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
