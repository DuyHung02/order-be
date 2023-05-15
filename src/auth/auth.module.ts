import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { JwtModule, JwtService } from "@nestjs/jwt";
import { User } from '../user/entity/User';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entity/Otp';
import { UserModule } from "../user/user.module";
import { jwtConstants } from "./auth.constants";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { RolesGuard } from "../user/roles.guard";
import { Role } from "../user/entity/Role";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s'}
    }),
    TypeOrmModule.forFeature([User, Otp, Role]),
  ],
  providers: [AuthService, JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
  controllers: [AuthController],
})
export class AuthModule {}
