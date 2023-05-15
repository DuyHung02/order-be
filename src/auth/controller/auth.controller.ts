import { Body, Controller, Get, Param, Post, Req, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { AuthOtp } from "../type/AuthOtp";
import { CreateUser } from "../../user/dtos/CreateUser";
import { Roles } from "../../user/roles.decorator";
import { Role } from "../../user/entity/role.enum";
import { SignInDto } from "../dtos/SignInDto";
import { SkipAuth } from "../auth.decorator";
import { AuthGuard } from "../auth.guard";
import { RolesGuard } from "../../user/roles.guard";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @Get('check/:email')
  checkEmail(@Param('email') email: string) {
    return this.authService.checkEmail(email);
  }

  @Get('find/user/:email')
  findUserByEmail(@Param('email') email: string) {
    return this.authService.findUserByEmail(email);
  }

  @SkipAuth()
  @Get('send/otp/:email')
  sendOtpRegister(@Param('email') email: string) {
    const sub = 'Welcome to my website';
    return this.authService.sendOtpRegister(email, sub);
  }

  @SkipAuth()
  @Post('check/otp')
  checkOtp(@Body() authOtp: AuthOtp) {
    const email = authOtp.email;
    const confirmOtp = authOtp.confirmOtp;
    const typeCode = authOtp.typeCode;
    return this.authService.checkOtp(email, confirmOtp, typeCode);
  }

  @SkipAuth()
  @Post('register')
  register(@Body() user: CreateUser) {
    const email = user.email
    const password = user.password
    return this.authService.register(email, password);
  }

  @SkipAuth()
  @Post('login')
  signIn(@Body() signDto: SignInDto) {
    return this.authService.signIn(signDto.email, signDto.password);
  }

  @Get('auth')
  getAuthReq(@Request() req) {
    return req.user
  }

  @Roles(Role.ADMIN)
  @Get('admin')
  getAdmin() {
    return 'Here admin'
  }

  @Roles(Role.USER)
  @Get('user')
  getUser() {
    return 'Here user'
  }

  @Get('test')
  getTest(@Req() req) {
    console.log(req.user);
  }
}
