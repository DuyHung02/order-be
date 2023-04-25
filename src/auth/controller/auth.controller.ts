import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthOtp } from '../type/AuthOtp';
import { CreateUser } from '../../user/dtos/CreateUser';
import { UserChangePass } from '../../user/dtos/UserChangePass';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('check/:email')
  checkEmail(@Param('email') email: string) {
    return this.authService.checkEmail(email);
  }

  @Get('find/user/:email')
  findUSerByEmail(@Param('email') email: string) {
    return this.authService.findUserByEmail(email);
  }

  @Get('send/otp/:email')
  sendOtpRegister(@Param('email') email: string) {
    const sub = 'Welcome to my website';
    return this.authService.sendOtpRegister(email, sub);
  }

  @Post('check/otp')
  checkOtp(@Body() authOtp: AuthOtp) {
    const email = authOtp.email;
    const confirmOtp = authOtp.confirmOtp;
    const typeCode = authOtp.typeCode;
    return this.authService.checkOtp(email, confirmOtp, typeCode);
  }

  @Post('register')
  register(@Body() user: CreateUser) {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body() user: CreateUser) {
    const email = user.email;
    const password = user.password;
    return this.authService.login(email, password);
  }

  @Get('test')
  getUser() {
    return HttpStatus.OK;
  }
}
