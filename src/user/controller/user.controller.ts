import {
  Body,
  Controller,
  Get,
  Param,
  Post, Request
} from "@nestjs/common";
import { UserService } from '../service/user.service';
import { AuthOtp } from '../../auth/type/AuthOtp';
import { UserChangePass } from '../dtos/UserChangePass';
import { UserCheckEmail } from '../dtos/UserCheckEmail';
import { DepositProfile } from "../../profile/dtos/DepositProfile";
import { Roles } from "../roles.decorator";
import { Role } from "../entity/role.enum";
import { SkipAuth } from "../../auth/auth.decorator";

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @SkipAuth()
  @Get('find')
  findUserById(@Request() req) {
    const userId = req.user.id
    return this.userService.findUserById(userId);
  }

  @Get('find/role')
  findUserRole(@Request() req) {
    const userId = req.user.id
    return this.userService.findUserRole(userId)
  }

  @Get('send/otp/:email')
  sendOtpChangePass(@Param('email') email: string) {
    const sub = 'Change password';
    return this.userService.sendOtpChangePassword(email, sub);
  }

  @Post('deposit')
  saveBalance(@Body() depositProfile: DepositProfile) {
    const profileId = depositProfile.profileId
    const deposit = depositProfile.deposit
    return this.userService.saveBalance(profileId, deposit)
  }

  @Post('check/otp/change/password')
  checkOtpChangePassword(@Body() authOtp: AuthOtp) {
    const email = authOtp.email;
    const confirmOtp = authOtp.confirmOtp;
    const typeCode = authOtp.typeCode;
    return this.userService.checkOtpChangePass(email, confirmOtp, typeCode);
  }

  @Post('change/password')
  changePassword(@Body() user: UserChangePass) {
    const id = user.id;
    const email = user.email;
    const password = user.password;
    const code = user.code;
    const typeCode = user.typeCode;
    return this.userService.changePassword(id, email, password, code, typeCode);
  }

  @Post('check/email')
  checkEmailUser(@Body() user: UserCheckEmail) {
    const userId = user.id;
    const email = user.email;
    return this.userService.checkUserMail(userId, email);
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
}
