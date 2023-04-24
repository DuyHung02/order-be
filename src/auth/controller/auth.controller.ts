import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { AuthOtp } from '../type/AuthOtp';
import { CreateUser } from '../../user/dtos/CreateUser';
import { AuthGuard } from '@nestjs/passport';

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
  sendOtp(@Param('email') email: string) {
    return this.authService.sendOtpToMail(email);
  }

  @Post('check/otp')
  checkOtp(@Body() authOtp: AuthOtp) {
    const otp = authOtp.otp;
    const confirmOtp = authOtp.confirmOtp;
    return this.authService.checkOtp(otp, confirmOtp);
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

  @Post('change/password')
  changePassword(@Body() user: CreateUser) {
    const id = user.id;
    const password = user.password;
    return this.authService.changePassword(id, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user')
  getUser() {
    console.log('user');
  }
}
