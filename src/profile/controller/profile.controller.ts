import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { ProfileService } from "../service/profile.service";
import { UpdateProfile } from "../dtos/UpdateProfile";
import { AuthOtp } from "../../auth/type/AuthOtp";
import { DepositProfile } from "../dtos/DepositProfile";

@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {
  }

  @Post('create')
  createProfile(@Request() req) {
    const userId = req.user.id
    return this.profileService.createProfile(userId)
  }

  @Post('update')
  updateProfile(@Body() updateProfile: UpdateProfile) {
    return this.profileService.updateUserProfile(updateProfile)
  }

  @Get('find')
  findUserProfile(@Request() req) {
    const userId = req.user.id
    return this.profileService.findUserProfile(userId)
  }

  @Get('send/otp/deposit')
  sendOtpDeposit(@Request() req) {
    const email = req.user.email
    const sub = 'Mã thực hiện yêu cầu chuyển tiền '
    return this.profileService.sendOtpDeposit(email, sub)
  }

  @Post('deposit')
  saveBalance(@Body() depositProfile: DepositProfile, @Request() req) {
    const userId = req.user.id
    const deposit = depositProfile.deposit
    return this.profileService.saveBalance(userId, deposit)
  }

  @Post('check/otp/deposit')
  checkOtpDeposit(@Body() authOtp: AuthOtp, @Request() req) {
    const email = req.user.email
    const confirmOtp = authOtp.confirmOtp;
    const typeCode = authOtp.typeCode;
    return this.profileService.checkOtpDeposit(email, confirmOtp, typeCode);
  }
}
