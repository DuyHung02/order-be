import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateProfile } from '../../profile/dtos/CreateProfile';
import { AuthGuard } from '@nestjs/passport';
import { AuthOtp } from '../../auth/type/AuthOtp';
import { UserChangePass } from '../dtos/UserChangePass';
import { UserCheckEmail } from '../dtos/UserCheckEmail';
import { DepositProfile } from "../../profile/dtos/DepositProfile";

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':id/profile')
  createUserProfile(@Param('id', ParseIntPipe) id: number) {
    return this.userService.createUserProfile(id);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post(':id/profile/update')
  updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: CreateProfile,
  ) {
    return this.userService.updateUserProfile(id, profile);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('find/user/:id')
  findUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id);
  }

  @Get('send/otp/:email')
  sendOtpChangePass(@Param('email') email: string) {
    console.log(email);
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
}
