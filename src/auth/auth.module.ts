import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule, JwtService } from "@nestjs/jwt";
import { User } from '../user/entity/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entity/Otp';
import { Role } from '../entity/Role';
import { AuthMiddleware } from "./auth.middleware";

@Module({
  imports: [
    // JwtModule.register({}),
    TypeOrmModule.forFeature([User, Otp, Role]),
  ],
  providers: [AuthService, AuthMiddleware, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
